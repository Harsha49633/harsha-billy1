import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ChatBotProps {
  onReportSubmit: (report: any) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onReportSubmit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [reportData, setReportData] = useState({
    name: '',
    age: '',
    state: '',
    district: '',
    city: '',
    bullyingType: '',
    evidenceLinks: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    addBotMessage("Hi! I'm Billy, your friendly anti-bullying assistant. I'm here to help you report cyberbullying incidents. What's your name?");
  }, []);

  const addBotMessage = (text: string, options?: string[]) => {
    setMessages(prev => [...prev, {
      id: uuidv4(),
      text,
      sender: 'bot',
      type: options ? 'options' : undefined,
      options
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: uuidv4(),
      text,
      sender: 'user'
    }]);
  };

  const handleNextStep = (userInput: string) => {
    addUserMessage(userInput);

    switch (currentStep) {
      case 0: // Name
        setReportData(prev => ({ ...prev, name: userInput }));
        addBotMessage("Thank you. How old are you?");
        break;
      case 1: // Age
        setReportData(prev => ({ ...prev, age: userInput }));
        addBotMessage("Which state do you live in?");
        break;
      case 2: // State
        setReportData(prev => ({ ...prev, state: userInput }));
        addBotMessage("What district are you from?");
        break;
      case 3: // District
        setReportData(prev => ({ ...prev, district: userInput }));
        addBotMessage("And which city?");
        break;
      case 4: // City
        setReportData(prev => ({ ...prev, city: userInput }));
        addBotMessage(
          "What type of cyberbullying are you experiencing?",
          [
            "Harassment",
            "Cyberstalking",
            "Impersonation",
            "Hate Speech",
            "Threats",
            "Other"
          ]
        );
        break;
      case 5: // Bullying Type
        setReportData(prev => ({ ...prev, bullyingType: userInput }));
        addBotMessage("Please provide any evidence links (social media posts, screenshots, etc.):");
        break;
      case 6: // Evidence
        setReportData(prev => ({ ...prev, evidenceLinks: userInput }));
        const location = `${reportData.city}, ${reportData.district}, ${reportData.state}`;
        onReportSubmit({
          ...reportData,
          evidenceLinks: userInput,
          location
        });
        addBotMessage("Thank you for your report. It has been submitted and will be reviewed by our team. Is there anything else I can help you with?");
        setCurrentStep(-1); // Reset the conversation
        return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    handleNextStep(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-gray-50 rounded-lg border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border shadow-sm'
              }`}
            >
              {message.type === 'options' ? (
                <div className="space-y-2">
                  <p className="text-gray-800 mb-2">{message.text}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {message.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          handleNextStep(option);
                          setInput('');
                        }}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot;