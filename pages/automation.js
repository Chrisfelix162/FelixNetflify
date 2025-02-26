import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Automation tool card component
const AutomationCard = ({ title, description, icon, isActive, onClick }) => (
  <div 
    className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
      isActive 
        ? 'border-blue-500 bg-blue-50 shadow-md' 
        : 'border-gray-200 hover:border-blue-300 hover:shadow'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start">
      <div className={`p-3 rounded-full mr-4 ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    <div className="mt-4 flex justify-between items-center">
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
        isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Available'}
      </span>
      <button 
        className={`text-sm font-medium ${
          isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        {isActive ? 'Configure' : 'Enable'}
      </button>
    </div>
  </div>
);

export default function AutomationDashboard() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [automationTools, setAutomationTools] = useState([
    {
      id: 'email-notifications',
      title: 'Email Notifications',
      description: 'Send email notifications when video processing is complete',
      isActive: false,
      icon: (
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
      config: {
        emailTemplate: 'default',
        recipients: []
      }
    },
    {
      id: 'discord-webhook',
      title: 'Discord Integration',
      description: 'Post summaries to a Discord channel via webhook',
      isActive: true,
      icon: (
        <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>
        </svg>
      ),
      config: {
        webhookUrl: 'https://discord.com/api/webhooks/...',
        messageTemplate: 'default'
      }
    },
    {
      id: 'google-drive',
      title: 'Google Drive Export',
      description: 'Automatically save summaries to Google Drive',
      isActive: false,
      icon: (
        <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.75 13.81v7.44l6.48-3.72-6.48-3.72zm-1.5 0l-6.48 3.72 6.48 3.72v-7.44zm-6.11-3.56l6.48 3.72 6.48-3.72-6.48-3.72-6.48 3.72zm7.61-7.5L6.26 9.47h11.48L11.25 2.75z" fill="currentColor"/>
        </svg>
      ),
      config: {
        folderId: '',
        fileFormat: 'pdf'
      }
    },
    {
      id: 'slack-integration',
      title: 'Slack Integration',
      description: 'Share summaries to Slack channels',
      isActive: false,
      icon: (
        <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 15a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm12 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" fill="currentColor"/>
        </svg>
      ),
      config: {
        workspaceId: '',
        channelId: '',
        messageFormat: 'default'
      }
    },
    {
      id: 'zapier-webhook',
      title: 'Zapier Integration',
      description: 'Connect to thousands of apps via Zapier',
      isActive: false,
      icon: (
        <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm5.472-9.513L13.287 6.28l-1.254.943 2.218 3.012-6.083 4.678.943 1.254 7.115-5.499c.32-.32.32-.64 0-.96l-.754-.721z" fill="currentColor"/>
        </svg>
      ),
      config: {
        webhookUrl: '',
        dataFormat: 'json'
      }
    },
    {
      id: 'youtube-upload',
      title: 'YouTube Upload',
      description: 'Upload processed videos to YouTube with summary in description',
      isActive: false,
      icon: (
        <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.505 9.377.505 11.25 0a3.016 3.016 0 0 0 2.122-2.136c.502-1.884.502-5.814 0-7.7zm-1.5 5.814c-.282.42-.78.72-1.26.9l-6.72 2.16c-.48-.18-1.02-.06-1.44.3l-2.16 1.56c-.42.36-.54.9-.36 1.38.3l2.16-1.56c.42.18.9.06 1.26-.3l6.72-2.16c.48-.18 1.02.06 1.38.54z" fill="currentColor"/>
        </svg>
      ),
      config: {
        folderId: '',
        fileFormat: 'pdf'
      }
    }
  ]);

  return (
    <div>
      {/* Rest of the component code */}
    </div>
  );
} 