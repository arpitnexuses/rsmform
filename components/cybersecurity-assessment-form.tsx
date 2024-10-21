'use client'

import { useState, useEffect, useId } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Check, Mail, ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from 'framer-motion'
import ReactConfetti from 'react-confetti'

// Add this custom hook
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

const questions = [
  {
    id: "q1",
    text: "How mature is your organization's risk management strategy?",
    options: [
      { value: "10", label: "Risk management is fully integrated into enterprise-wide decision-making, aligned with frameworks, and reviewed continuously." },
      { value: "7", label: "Risk management is defined and reviewed periodically at a senior level." },
      { value: "4", label: "Risk management is performed ad-hoc and inconsistently." },
      { value: "0", label: "There is no formal risk management strategy in place." },
    ],
  },
  {
    id: "q2",
    text: "How effectively does your SOC (Security Operations Center) manage and monitor incidents?",
    options: [
      { value: "10", label: "The SOC employs a 24/7 monitoring approach with continuous integration of threat intelligence feeds and uses an experiential platform for live-fire incident response exercises." },
      { value: "7", label: "The SOC monitors and responds to incidents within regular business hours using established playbooks." },
      { value: "4", label: "The SOC provides basic monitoring and relies on incident escalation to other teams." },
      { value: "0", label: "There is no formal SOC, and monitoring is ad-hoc." },
    ],
  },
  {
    id: "q3",
    text: "How comprehensive is your organization's third-party audit process?",
    options: [
      { value: "10", label: "Regular third-party audits are conducted annually, following industry-recognized standards like ISO 27001, SOC 2, and PCI DSS. Findings are integrated into the risk management framework." },
      { value: "7", label: "Third-party audits are conducted every two to three years, addressing key compliance areas." },
      { value: "4", label: "Third-party audits are sporadically conducted, without structured integration into the risk management plan." },
      { value: "0", label: "No formal third-party audits are conducted." },
    ],
  },
  {
    id: "q4",
    text: "How do you manage governance, risk, and compliance (GRC) within your organization?",
    options: [
      { value: "10", label: "A centralized GRC platform is actively used to monitor, assess, and manage governance, risk, and compliance across the organization, with periodic updates and alignment to industry frameworks." },
      { value: "7", label: "GRC is managed using a combination of manual tracking and automated reports with annual reviews." },
      { value: "4", label: "GRC efforts are handled informally with occasional checks and manual reporting." },
      { value: "0", label: "No formal GRC management framework is in place." },
    ],
  },
  {
    id: "q5",
    text: "To what extent are incident response plans defined and tested?",
    options: [
      { value: "10", label: "Incident response plans are fully integrated into an experiential platform where team members regularly participate in live-fire exercises and simulations of evolving threats. Lessons learned are immediately fed back to improve processes." },
      { value: "7", label: "Incident response plans exist and are regularly tested using tabletop exercises or simple simulations in line with ISO/IEC 27035." },
      { value: "4", label: "Incident response plans exist but are rarely tested beyond basic documentation checks." },
      { value: "0", label: "There are no formal incident response plans in place." },
    ],
  },
  {
    id: "q6",
    text: "How effectively are user and administrative privileges managed in your organization?",
    options: [
      { value: "8", label: "Privileged access is strictly controlled using the principle of least privilege and monitored with PAM solutions like CyberArk or BeyondTrust, reviewed quarterly." },
      { value: "6", label: "Access management policies are in place, and reviews occur periodically." },
      { value: "4", label: "Access management is informal, with no regular reviews." },
      { value: "0", label: "Privileged access is not managed systematically." },
    ],
  },
  {
    id: "q7",
    text: "What level of cybersecurity awareness training do employees receive?",
    options: [
      { value: "8", label: "Comprehensive, platform-based, and experiential training tailored to specific roles and threats, including simulated phishing attacks and immersive labs with real-time threat scenarios." },
      { value: "6", label: "Standardized cybersecurity awareness training is conducted annually for all employees, focusing on compliance standards like GDPR, CCPA, or HIPAA." },
      { value: "4", label: "Basic awareness training is provided irregularly, mostly covering generic threats." },
      { value: "0", label: "No formal cybersecurity awareness training is provided." },
    ],
  },
  {
    id: "q8",
    text: "How comprehensive is your organization's vulnerability management program?",
    options: [
      { value: "10", label: "Vulnerabilities are continuously scanned using automated tools like Qualys or Nessus, prioritized based on risk, and patched within established SLAs." },
      { value: "7", label: "Vulnerability assessments are conducted periodically, with prioritization given to critical assets." },
      { value: "4", label: "Vulnerability scans occur infrequently, with no defined prioritization or patching process." },
      { value: "0", label: "Vulnerabilities are not actively managed." },
    ],
  },
  {
    id: "q9",
    text: "How do you measure and verify the effectiveness of your cybersecurity controls?",
    options: [
      { value: "8", label: "Controls are regularly reviewed and audited against benchmarks and compliance standards like ISO 27001, SOC 2, or NIST 800-53, with findings addressed proactively." },
      { value: "6", label: "Controls are assessed annually and compared against basic guidelines." },
      { value: "4", label: "Controls are only evaluated after a breach or major incident." },
      { value: "0", label: "There is no formal evaluation of cybersecurity controls." },
    ],
  },
  {
    id: "q10",
    text: "How do you assess and improve your team's cybersecurity skills?",
    options: [
      { value: "8", label: "Experiential learning programs with continuous hands-on labs, cyber ranges, and simulation environments are aligned with real-world attack scenarios and continuous skill evaluations." },
      { value: "6", label: "Annual skills assessments are conducted with some certification and formal training programs." },
      { value: "4", label: "Skills assessments are performed informally based on projects and incident responses." },
      { value: "0", label: "No formal skills assessment or improvement program exists." },
    ],
  },
  {
    id: "q11",
    text: "How do you evaluate the technical configuration of your security tools?",
    options: [
      { value: "8", label: "Security tools are regularly tested, optimized, and validated using an experiential platform or red team drills to ensure alignment with security baselines like CIS Controls or NIST 800-53." },
      { value: "6", label: "Security tools are tested annually for basic compliance and functionality." },
      { value: "4", label: "Technical assessments of tools are conducted only in response to incidents." },
      { value: "0", label: "Security tools are not regularly assessed for technical configuration." },
    ],
  },
  {
    id: "q12",
    text: "How effectively do you manage endpoint security within your organization?",
    options: [
      { value: "8", label: "Endpoint security is actively managed with EDR solutions like CrowdStrike or SentinelOne, with continuous monitoring, automated remediation, and regular reviews." },
      { value: "6", label: "Endpoint security is managed through traditional antivirus and periodic checks." },
      { value: "4", label: "Endpoint security is managed reactively, with infrequent monitoring." },
      { value: "0", label: "Endpoint security measures are limited or non-existent." },
    ],
  },
  {
    id: "q13",
    text: "How do you handle third-party risk assessments?",
    options: [
      { value: "8", label: "Third-party risks are actively assessed, monitored, and included in incident response planning, using frameworks like ISO 28000 or NIST SP 800-161." },
      { value: "6", label: "Third-party risks are assessed periodically with basic contracts and security clauses." },
      { value: "4", label: "Third-party risk assessments are performed informally." },
      { value: "0", label: "No formal assessment of third-party risks is conducted." },
    ],
  },
  {
    id: "q14",
    text: "How do you ensure compliance with industry and regulatory requirements?",
    options: [
      { value: "10", label: "Compliance programs are well-established for frameworks like GDPR, CCPA, HIPAA, PCI DSS, and include automated policy enforcement and periodic audits." },
      { value: "7", label: "Compliance policies are documented and reviewed annually for specific regulations." },
      { value: "4", label: "Compliance is loosely managed, with occasional policy checks." },
      { value: "0", label: "Compliance efforts are minimal, with no formal checks in place." },
    ],
  },
  {
    id: "q15",
    text: "How frequently do you conduct penetration testing and red team exercises?",
    options: [
      { value: "10", label: "Penetration testing and red team exercises are conducted bi-annually on an experiential platform with scenarios closely mirroring real-world threat landscapes. Findings are integrated into incident response and risk management strategies." },
      { value: "7", label: "Penetration testing is conducted annually with a third-party vendor." },
      { value: "4", label: "Penetration tests are conducted occasionally, mostly in response to incidents." },
      { value: "0", label: "No formal penetration testing or red team exercises are conducted." },
    ],
  },
]

export function CybersecurityAssessmentForm() {
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '', company: '', position: '' })
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState<number | null>(null)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (score !== null) {
      const interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev < score) return prev + 1
          clearInterval(interval)
          return score
        })
      }, 20)
      return () => clearInterval(interval)
    }
  }, [score])

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value })
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const calculateScore = async () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value), 0)
    setScore(totalScore)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000) // Stop confetti after 5 seconds
    
    // Prepare the data to be sent via API
    const assessmentData = {
      personalInfo,
      answers,
      score: totalScore
    }
    
    // Send the data to the server
    try {
      const response = await fetch('/api/send-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to send assessment results');
      }

      // Optionally, you can log a success message to the console
      console.log('Assessment results sent successfully');
    } catch (error) {
      // Optionally, you can log the error to the console
      console.error('Error sending assessment results:', error);
    }
  }

  const getResultText = (score: number) => {
    if (score >= 85) return "Advanced Cyber Maturity - Fine as it is."
    if (score >= 65) return "Aligned to Foundational Values - May look at framework standards."
    if (score >= 35) return "Basic Measures in Place - Thorough assessment required in the mid-term."
    return "Immediate assessment required in Cyber Posture."
  }

  const progress = ((currentQuestion + 1) / (questions.length + 1)) * 100

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 65) return "text-yellow-500";
    if (score >= 35) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-green-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      {showConfetti && <ReactConfetti width={width} height={height} />}
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden mb-8" 
          style={{ marginTop: '25px' }}
        >
          <div className="bg-white p-8">
            <div className="flex justify-between items-center mb-6">
              <Image
                src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/logo@2x_8da173cb-2675-4b88-ac00-4d8d269f4dc4.webp"
                alt="Nexlink Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Cyber Self Assessment Tool</h2>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">Hi Dear, {personalInfo.name || 'User'}</h1>
            <p className="text-xl text-gray-600">Welcome to RSM Cyber Self Assessment Tool</p>
          </div>

          <div className="bg-gradient-to-br from-purple-200 via-green-200 to-purple-200 p-8">
            <AnimatePresence mode="wait">
              {currentQuestion === 0 ? (
                <motion.div
                  key="personal-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="m-8 border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-2xl text-green-700">Personal Information</CardTitle>
                      <CardDescription>Please provide your details before starting the assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="border-gray-300" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="border-gray-300" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" name="company" value={personalInfo.company} onChange={handlePersonalInfoChange} className="border-gray-300" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input id="position"   name="position" value={personalInfo.position} onChange={handlePersonalInfoChange} className="border-gray-300" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleNext} className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">Start Assessment</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : score === null ? (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="m-8 border-none shadow-none bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl text-green-700">Question {currentQuestion} of {questions.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <p className="text-lg font-medium text-gray-700">{questions[currentQuestion - 1].text}</p>
                        <div className="space-y-4">
                          {questions[currentQuestion - 1].options.map((option) => {
                            const id = `${questions[currentQuestion - 1].id}-${option.value}`
                            return (
                              <div key={option.value} className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  id={id}
                                  name={questions[currentQuestion - 1].id}
                                  value={option.value}
                                  checked={answers[questions[currentQuestion - 1].id] === option.value}
                                  onChange={() => handleAnswerChange(questions[currentQuestion - 1].id, option.value)}
                                  className="sr-only peer"
                                />
                                <Label
                                  htmlFor={id}
                                  className={cn(
                                    "flex flex-1 items-center rounded-lg border border-gray-200 bg-white p-4 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer",
                                    answers[questions[currentQuestion - 1].id] === option.value && "border-green-500 ring-1 ring-green-500"
                                  )}
                                >
                                  <div className={cn(
                                    "flex-shrink-0 w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center",
                                    answers[questions[currentQuestion - 1].id] === option.value && "border-green-500 bg-green-500"
                                  )}>
                                    <Check className={cn(
                                      "w-3 h-3 text-white",
                                      answers[questions[currentQuestion - 1].id] === option.value ? "opacity-100" : "opacity-0"
                                    )} />
                                  </div>
                                  <span className="flex-grow">{option.label}</span>
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button onClick={handleBack} disabled={currentQuestion === 1} className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button onClick={handleNext} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white">
                        {currentQuestion === questions.length ? 'Finish' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="m-8 border-none shadow-none bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-3xl text-green-700 text-center">Assessment Results</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-8">
                      <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: animatedScore / 100 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="50%" stopColor="#eab308" />
                              <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                          </defs>
                          <motion.text
                            x="50"
                            y="50"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className={`text-3xl font-bold ${getScoreColor(animatedScore)}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                          >
                            {animatedScore}
                          </motion.text>
                        </svg>
                      </div>
                      <motion.p 
                        className="text-2xl text-center font-medium text-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        {getResultText(score)}
                      </motion.p>
                      
                      <div className="w-full max-w-md mt-8 relative">
                        <motion.div 
                          className="relative inline-block text-left w-full"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            type="button"
                            className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center bg-white shadow-sm"
                          >
                            <Mail className="w-5 h-5 text-gray-600" />
                            <span>Book an Appointment with RSM Team</span>
                            <ChevronDown className="w-5 h-5 ml-2 text-gray-600" />
                          </button>
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                              >
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  <a
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=anisha@cs.rsm.ae&su=Appointment Request with RSM Team"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                  >
                                    <i className="fab fa-google mr-2"></i> Gmail
                                  </a>
                                  <a
                                    href="https://outlook.office.com/mail/deeplink/compose?to=anisha@cs.rsm.ae&subject=Appointment%20Request%20with%20RSM%20Team"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem"
                                  >
                                    <i className="fab fa-microsoft mr-2"></i> Outlook
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                      
                      
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Improved Progress bar */}
            {score === null && (
              <motion.div 
                className="px-8 pb-8 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500" 
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center px-1">
                    {Array.from({ length: questions.length + 1 }).map((_, index) => (
                      <motion.div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentQuestion ? 'bg-white' : 'bg-gray-400'
                        } ${index === currentQuestion ? 'ring-1 ring-white' : ''}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Add these lines at the end of the file
export { questions };
export type Question = {
  id: string;
  text: string;
  options: Array<{ value: string; label: string }>;
};
