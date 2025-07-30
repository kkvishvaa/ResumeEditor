import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import * as mammoth from "mammoth";
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import ATSCheckerModal from './components/ATSCheckerModal';
import LoadingOverlay from './components/LoadingOverlay';
import { extractKeywords, generateBulletPoint, generateNewBulletPoint, checkATSScore } from './handlers';
import { waitForIframeReady, handleOutsideClick } from './utils';
import { useATSChecker, useResumeEditor } from './hooks';

const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY || "";

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const ResumeGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedBullet, setSelectedBullet] = useState<string>('');
  const [selectedBulletPos, setSelectedBulletPos] = useState<number | null>(null);
  const [generatedBullet, setGeneratedBullet] = useState('');
  const [newBulletKeyword, setNewBulletKeyword] = useState('');
  const [newBulletLines, setNewBulletLines] = useState<1 | 2>(1);
  const [newBulletHeader, setNewBulletHeader] = useState(true);
  const [newBulletResult, setNewBulletResult] = useState('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsFeedback, setAtsFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [fileId, setFileId] = useState('');
  const [editorUrl, setEditorUrl] = useState('');
  const fileInput = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const resumeRef = useResumeEditor();
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [showATSChecker, setShowATSChecker] = useState(false);

  // Extract keywords from job description
  const handleExtractKeywords = async () => {
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const extracted = await extractKeywords(jobDescription);
      setKeywords(extracted);
      setSelectedKeywords([]);
    } catch (error) {
      alert('Failed to extract keywords. Please try again.');
    }
    setIsLoading(false);
  };

  // Generate improved bullet point
  const handleGenerateBullet = async () => {
    if (!selectedBullet || selectedKeywords.length === 0) return;
    setIsLoading(true);
    try {
      const generated = await generateBulletPoint(selectedKeywords, selectedBullet);
      setGeneratedBullet(generated);
    } catch (error) {
      alert('Failed to generate bullet point. Please try again.');
    }
    setIsLoading(false);
  };

  // Accept generated bullet point (now replaces the correct bullet)
  const handleAcceptBullet = () => {
    if (!resumeRef.current || !generatedBullet) {
      console.error('Resume reference or generated bullet is missing.');
      return;
    }
    const editor = resumeRef.current.querySelector('iframe');
    if (!editor?.contentWindow) {
      console.error('Editor iframe or content window is not accessible.');
      return;
    }
    waitForIframeReady(editor, () => {
      const message = {
        MessageId: 'Action_Paste',
        SendTime: Date.now(),
        Values: {
          Mimetype: 'text/plain;charset=utf-8',
          Data: generatedBullet
        }
      };
      console.log('Sending postMessage:', message);
      editor.contentWindow!.postMessage(JSON.stringify(message), '*');
      setGeneratedBullet('');
      setSelectedBullet('');
      setSelectedBulletPos(null);
    });
  };

  // Generate new bullet point
  const handleGenerateNewBullet = async () => {
    if (!newBulletKeyword.trim()) return;
    setIsLoading(true);
    try {
      const generated = await generateNewBulletPoint(
        newBulletKeyword,
        newBulletLines,
        newBulletHeader
      );
      setNewBulletResult(generated);
    } catch (error) {
      alert('Failed to generate new bullet point. Please try again.');
    }
    setIsLoading(false);
  };

  // Insert new bullet point into editor
  const handleInsertNewBullet = () => {
    if (!resumeRef.current || !newBulletResult) {
      console.error('Resume reference or new bullet result is missing.');
      return;
    }
    const editor = resumeRef.current.querySelector('iframe');
    if (!editor?.contentWindow) {
      console.error('Editor iframe or content window is not accessible.');
      return;
    }
    waitForIframeReady(editor, () => {
      const message = {
        MessageId: 'Action_Paste',
        SendTime: Date.now(),
        Values: {
          Mimetype: 'text/plain;charset=utf-8',
          Data: newBulletResult
        }
      };
      console.log('Sending postMessage:', message);
      editor.contentWindow!.postMessage(JSON.stringify(message), '*');
      setNewBulletResult('');
    });
  };

  // Check ATS score
  const handleCheckATS = async () => {
    if (!resumeRef.current || !jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const editor = resumeRef.current.querySelector('iframe');
      if (!editor) return;
      const contentWindow = editor.contentWindow;
      if (!contentWindow) return;
      contentWindow.postMessage(
        {
          type: 'GET_TEXT',
        },
        '*'
      );
      window.addEventListener('message', function handler(event) {
        if (event.origin !== window.location.origin) return;
        const { resumeText } = event.data;
        if (resumeText) {
          handleCheckATSScoreAndSetState(resumeText, jobDescription);
        }
        window.removeEventListener('message', handler);
      });
    } catch (error) {
      alert('Failed to check ATS score. Please try again.');
    }
    setIsLoading(false);
  };

  // Renamed to avoid conflict with global checkATSScore
  const handleCheckATSScoreAndSetState = async (resumeText: string, jobDescription: string) => {
    const result = await checkATSScore(resumeText, jobDescription);
    if (result) {
      setAtsScore(result.score);
      setAtsFeedback(result.feedback);
    }
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) {
      console.error('Resume reference is missing.');
      return;
    }
    setIsLoading(true);
    try {
      const dataUrl = await toPng(resumeRef.current, { quality: 0.95 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    }
    setIsLoading(false);
  };

  const handleUpload = async () => {
    if (!fileInput.current?.files?.[0]) return;
    setDocxLoading(true);
    const file = fileInput.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:8080/upload', formData);
      const id = response.data.fileId;
      setFileId(id);

      const backendHost = "host.docker.internal";

      const wopiSrc = encodeURIComponent(`http://${backendHost}:8080/wopi/files/${id}`);
      const url = `http://localhost:9980/browser/dist/cool.html?WOPISrc=${wopiSrc}&lang=en&permission=edit`;

      setEditorUrl(url);
    } catch (err) {
      console.error('Upload error:', err);
    }
    setDocxLoading(false);
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(kw => kw !== keyword)
        : [...prev, keyword]
    );
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedResume(file);
  };

  const handleCheckATSForUploadedResume = async () => {
    if (!uploadedResume || !jobDescription.trim()) {
      alert("Please upload a resume and provide a job description.");
      return;
    }

    setIsLoading(true);
    try {
      let atsResult: { score: number; feedback: string } | null = null;

      if (uploadedResume.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Handle .docx files using mammoth.js
        const arrayBuffer = await uploadedResume.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const resumeText = result.value;
        atsResult = await checkATSScore(resumeText, jobDescription);
      } else {
        // Handle other text-based formats
        const reader = new FileReader();
        reader.onload = async (e) => {
          const resumeText = e.target?.result as string;
          const result = await checkATSScore(resumeText, jobDescription);
          if (result) {
            setAtsScore(result.score);
            setAtsFeedback(result.feedback);
          }
        };
        reader.readAsText(uploadedResume);
      }

      if (atsResult) {
        setAtsScore(atsResult.score);
        setAtsFeedback(atsResult.feedback);
      }
    } catch (error) {
      console.error("Error checking ATS score:", error);
      alert("Failed to check ATS score. Please try again.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const closeModal = () => setShowATSChecker(false);
    const modalSelector = ".fixed.inset-0.bg-black.bg-opacity-50 > .bg-white";

    if (showATSChecker) {
      document.addEventListener("mousedown", (event) => handleOutsideClick(event, modalSelector, closeModal));
    } else {
      document.removeEventListener("mousedown", (event) => handleOutsideClick(event, modalSelector, closeModal));
    }

    return () => {
      document.removeEventListener("mousedown", (event) => handleOutsideClick(event, modalSelector, closeModal));
    };
  }, [showATSChecker]);

  useEffect(() => {
    const sendPostMessageReady = () => {
      const editor = resumeRef.current?.querySelector('iframe');
      if (editor?.contentWindow) {
        editor.contentWindow.postMessage(
          JSON.stringify({
            MessageId: 'Host_PostmessageReady',
            SendTime: Date.now(),
            Values: {}
          }),
          'http://localhost:9980' // Replace with the actual origin
        );
        console.log('Sent Host_PostmessageReady');
      }
    };

    const handleMessage = (event: MessageEvent) => {
      // Accept all origins for debugging (but restrict in production)
      console.log('Received message from Collabora editor:', event.origin, event.data);

      // Debugging: Log all incoming messages
      if (event.data) {
        try {
          const message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          console.log('Parsed message:', message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    sendPostMessageReady();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const toggleATSChecker = () => {
    setShowATSChecker((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header />
      <div className="flex flex-col lg:flex-row gap-6">
        <LeftPanel
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          isLoading={isLoading}
          handleExtractKeywords={handleExtractKeywords}
          keywords={keywords}
          selectedKeywords={selectedKeywords}
          toggleKeyword={toggleKeyword}
          selectedBullet={selectedBullet}
          setSelectedBullet={setSelectedBullet}
          handleGenerateBullet={handleGenerateBullet}
          generatedBullet={generatedBullet}
          handleAcceptBullet={handleAcceptBullet}
          setGeneratedBullet={setGeneratedBullet}
        />
        <CenterPanel
          editorUrl={editorUrl}
          resumeRef={resumeRef}
          atsScore={atsScore}
          atsFeedback={atsFeedback}
          toggleATSChecker={toggleATSChecker}
          docxLoading={docxLoading}
          handleUpload={handleUpload}
          fileInput={fileInput}
        />
        <RightPanel
          newBulletKeyword={newBulletKeyword}
          setNewBulletKeyword={setNewBulletKeyword}
          newBulletLines={newBulletLines}
          setNewBulletLines={setNewBulletLines}
          newBulletHeader={newBulletHeader}
          setNewBulletHeader={setNewBulletHeader}
          handleGenerateNewBullet={handleGenerateNewBullet}
          isLoading={isLoading}
          newBulletResult={newBulletResult}
          handleInsertNewBullet={handleInsertNewBullet}
        />
      </div>

      {showATSChecker && (
        <ATSCheckerModal
          uploadedResume={uploadedResume}
          handleResumeUpload={handleResumeUpload}
          handleCheckATSForUploadedResume={handleCheckATSForUploadedResume}
          isLoading={isLoading}
          jobDescription={jobDescription}
        />
      )}

      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default ResumeGenerator;