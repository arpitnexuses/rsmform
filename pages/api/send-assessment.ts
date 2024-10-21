import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

// Import the questions array and its type
import { questions, Question } from '../../components/cybersecurity-assessment-form'

// Define the structure of the request body
interface AssessmentData {
  personalInfo: {
    name: string;
    email: string;
    company: string;
    position: string;
  };
  answers: Record<string, string>;
  score: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { personalInfo, answers, score } = req.body as AssessmentData

  // Create a transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // Prepare email content with HTML formatting
  const emailContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2c3e50; text-align: center; }
          .score { font-size: 24px; font-weight: bold; color: #27ae60; text-align: center; }
          .section { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f2f2f2; }
          .logo { display: block; margin: 0 auto; max-width: 200px; background: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://cdn-nexlink.s3.us-east-2.amazonaws.com/logo@2x_8da173cb-2675-4b88-ac00-4d8d269f4dc4.webp" alt="RSM Logo" class="logo">
          <h1>Cybersecurity Assessment Results</h1>
          <div class="section">
            <table>
              <tr>
                <th colspan="2">Personal Information</th>
              </tr>
              <tr>
                <td><strong>Name:</strong></td>
                <td>${personalInfo.name}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>${personalInfo.email}</td>
              </tr>
              <tr>
                <td><strong>Company:</strong></td>
                <td>${personalInfo.company}</td>
              </tr>
              <tr>
                <td><strong>Position:</strong></td>
                <td>${personalInfo.position}</td>
              </tr>
            </table>
          </div>
          <div class="section">
            <h2 class="score">Assessment Score: ${score}</h2>
          </div>
          <div class="section">
            <table>
              <tr>
                <th>Question</th>
                <th>Answer</th>
              </tr>
              ${Object.entries(answers).map(([questionId, answerValue]) => {
                const question = questions.find((q: Question) => q.id === questionId);
                const answer = question?.options.find((opt: { value: string; label: string }) => opt.value === answerValue);
                return `
                  <tr>
                    <td>${question?.text || 'Unknown question'}</td>
                    <td>${answer?.label || 'Unknown answer'}</td>
                  </tr>
                `;
              }).join('')}
            </table>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: 'arpit.m@nexuses.in',
      subject: 'Cybersecurity Assessment Results',
      html: emailContent,
    })

    res.status(200).json({ message: 'Assessment results sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Failed to send assessment results' })
  }
}
