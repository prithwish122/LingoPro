"use client";
import React, { useState } from 'react';
import { Calendar, Clock, Trophy, Star, Users, Book, Bookmark, ChevronRight, X } from 'lucide-react';
import { ethers, BrowserProvider } from 'ethers';
import Link from 'next/link';
import lingPro from '../contractInfo/lingPro.json'

interface Lesson {
  title: string;
  level: string;
  duration: string;
  tokens: number;
  progress: number;
  status: 'Start' | 'Continue';
}

interface NativeSpeaker {
  name: string;
  language: string;
  time: string;
  available: boolean;
}

interface Reward {
  title: string;
  tokens: number;
  description?: string;
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

const DashboardPage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    donateInititate()
    // Additional logic for starting the lesson
  };

  const donateInititate = async () =>{
    const claimAmt = 10;
    const contractAddress = "0x94B2994f54BEeF1C03Ded4F74316E0f24428c4E4"
    const provider = new BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("Wallet Address:", address);
    const humorTokenContract = new ethers.Contract(contractAddress, lingPro.abi, signer)
    // mint();
    console.log(claimAmt, "========inside withdraw===")

    // await (await humorTokenContract.mint(address ,ethers.parseUnits(claimAmt.toString(), 18))).wait();
    await (await humorTokenContract.donate(address,"0x94A7Af5edB47c3B91d1B4Ffc2CA535d7aDA8CEDe" ,ethers.parseUnits(claimAmt.toString(), 18))).wait();

  }

  const withdrawInititate = async () =>{
    setShowDropdown(!showDropdown)
    const claimAmt = 25;
    const contractAddress = "0x94B2994f54BEeF1C03Ded4F74316E0f24428c4E4"
    const provider = new BrowserProvider(window.ethereum);

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log("Wallet Address:", address);
    const humorTokenContract = new ethers.Contract(contractAddress, lingPro.abi, signer)
    // mint();
    console.log(claimAmt, "========inside withdraw===")

    await (await humorTokenContract.mint(address ,ethers.parseUnits(claimAmt.toString(), 18))).wait();
    // await (await humorTokenContract.donate(address,"0x94A7Af5edB47c3B91d1B4Ffc2CA535d7aDA8CEDe" ,ethers.parseUnits(claimAmt.toString(), 18))).wait();

  }

  const lessons: Lesson[] = [
    {
      title: "Mastering Past Tense",
      level: "Intermediate",
      duration: "20 min",
      tokens: 50,
      progress: 0,
      status: "Start"
    },
    {
      title: "Essential Vocabulary",
      level: "Beginner",
      duration: "15 min",
      tokens: 30,
      progress: 25,
      status: "Continue"
    },
    {
      title: "Common Phrases",
      level: "Advanced",
      duration: "25 min",
      tokens: 60,
      progress: 75,
      status: "Continue"
    }
  ];

  const nativeSpeakers: NativeSpeaker[] = [
    { 
      name: "Maria Garcia",
      language: "Spanish",
      time: "2:00 PM",
      available: true
    },
    { 
      name: "Hans Weber",
      language: "German",
      time: "3:30 PM",
      available: true
    },
    { 
      name: "Yuki Tanaka",
      language: "Japanese",
      time: "5:00 PM",
      available: false
    }
  ];

  const rewards: Reward[] = [
    {
      title: "Extra Tokens",
      tokens: 50,
      description: "Get bonus tokens for your next lesson"
    },
    {
      title: "Free Lesson",
      tokens: 100,
      description: "Unlock a premium lesson for free"
    },
    {
      title: "1-on-1 Session",
      tokens: 250,
      description: "30-minute private session with a native speaker"
    }
  ];

  // Component for Native Speaker Card
  const NativeSpeakerCard: React.FC<{ speaker: NativeSpeaker }> = ({ speaker }) => (
    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:bg-white/50 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-medium">
          {speaker.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-800">{speaker.name}</h3>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{speaker.language}</span>
            <span>•</span>
            <span>{speaker.time}</span>
          </div>
        </div>
        <div>
          {speaker.available ? (
            <button className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-xs font-medium hover:bg-green-500/20 transition-colors duration-300">
              Available
            </button>
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              Not Available
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Component for Reward Card
  const RewardCard: React.FC<{ reward: Reward }> = ({ reward }) => (
    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:bg-white/50 transition-all duration-300">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-800">{reward.title}</h3>
          <div className="flex items-center space-x-2">
            <Trophy size={14} className="text-yellow-600" />
            <span className="text-sm font-semibold text-gray-900">{reward.tokens}</span>
          </div>
        </div>
        {reward.description && (
          <p className="text-xs text-gray-500">{reward.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f8f4f1] via-[#e8e6f4] to-[#f8e6e6]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-thin tracking-wide text-gray-900">
              LingoPro
            </Link>
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div
                  onClick={handleToggleDropdown}
                  className="flex items-center space-x-2 bg-white/50 rounded-full px-4 py-1 cursor-pointer"
                >
                  <Trophy size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">25</span>
                </div>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-4">
                    <button onClick={withdrawInititate} className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:bg-red-600 transition duration-300">
                      Withdraw
                    </button>
                  </div>
                )}
              </div>
              {!walletConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow duration-300"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow duration-300">
                  <span className="text-white text-xs">{walletAddress.slice(0, 5) + '...' + walletAddress.slice(-4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Daily Progress */}
        <div className="mb-12">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-gray-800">Today's Progress</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-500">45 mins studied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-sm text-gray-500">120 tokens earned</span>
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Lessons */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-light text-gray-800 mb-6">Daily Lessons</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={index} className="bg-white/40 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:bg-white/50 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">{lesson.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{lesson.level}</span>
                        <span>•</span>
                        <span>{lesson.duration}</span>
                        <span>•</span>
                        <span>{lesson.tokens} tokens</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => lesson.status === "Start" ? handleStartLesson(lesson) : null}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow duration-300"
                    >
                      {lesson.status}
                    </button>
                  </div>
                  {lesson.progress > 0 && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-1 rounded-full"
                        style={{ width: `${lesson.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Native Speakers and Rewards */}
          <div className="space-y-8">
            {/* Native Speakers */}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">Native Speakers</h2>
              <div className="space-y-4">
                {nativeSpeakers.map((speaker, index) => (
                  <NativeSpeakerCard key={index} speaker={speaker} />
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <h2 className="text-2xl font-light text-gray-800 mb-6">Rewards</h2>
              <div className="space-y-4">
                {rewards.map((reward, index) => (
                  <RewardCard key={index} reward={reward} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowConfirmation(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-medium text-gray-900 mb-4">Start Lesson</h3>
            <p className="text-gray-600 mb-6">
              This lesson requires 10 tokens to start. Would you like to proceed?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-shadow duration-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;