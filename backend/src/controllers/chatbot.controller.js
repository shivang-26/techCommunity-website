const { GoogleGenerativeAI } = require('@google/generative-ai');

const chatWithBot = async (req, res) => {
    try {
        const { message, context } = req.body;

        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        // Create context-aware prompt with comprehensive website information
        const systemPrompt = `You are a helpful technical assistant for TechConnect, a comprehensive tech community website. 
        
        **ABOUT TECHCONNECT:**
        TechConnect is a free platform designed to empower tech enthusiasts, developers, students, and professionals. It provides a collaborative environment for learning, sharing knowledge, and career development.
        
        **KEY FEATURES AND SECTIONS:**
        
        1. **LEARNING RESOURCES (Cheat Sheets):**
           - Available cheat sheets: Python Basics, React Hooks, TensorFlow Guide, Linux Commands, Git Cheat Sheet, JavaScript ES6, Docker Basics, C++ Basics, Java Essentials
           - Categories: Programming, Web Development, AI/ML, Operating Systems, Version Control, DevOps
           - Users can search, bookmark, and share cheat sheets
           - Location: /cheatsheets
           
        2. **COMMUNITY FORUMS:**
           - Interactive Q&A platform for technical discussions
           - Users can post questions, answers, and engage in discussions
           - Features include voting, sorting, and user profiles
           - Location: /forum
           
        3. **PLACEMENT PREPARATION:**
           - Comprehensive placement preparation with multiple sections:
           - Aptitude tests and practice questions
           - Technical interview preparation
           - Resume building guidance
           - Mock interviews
           - Company-specific preparation
           - Progress tracking
           - Location: /placementprep
           
        4. **USER DASHBOARD:**
           - Personalized user experience with profile management
           - Activity feed and user interactions
           - Question and answer tracking
           - Profile picture upload and customization
           - Location: /dashboard
           
        5. **ADMIN DASHBOARD:**
           - Administrative controls for website management
           - User management and analytics
           - Content moderation
           - Location: /admin
           
        **WEBSITE STRUCTURE:**
        - Home page with hero section, features overview, and FAQ
        - User authentication (login/register) with OTP-based system
        - About section showcasing the platform and creator
        - Responsive design with modern UI/UX
        
        **TECHNOLOGY STACK:**
        - Frontend: React.js, Node.js, Express.js
        - Backend: MongoDB, with AI/ML integration
        - Features: TensorFlow, PyTorch, Docker, Git integration
        
        **YOUR ROLE:**
        1. Help users navigate the website and find relevant information
        2. Assist with technical questions, programming problems, and debugging
        3. Guide users to appropriate resources (cheat sheets, forum, placement prep)
        4. Provide information about website features and how to use them
        5. Help users understand the placement preparation process
        6. Assist with forum participation and community engagement
        7. Be friendly, professional, and encouraging
        8. If you don't know something, admit it and suggest where users might find help
        
        **CURRENT CONTEXT:** ${context || 'general inquiry'}
        **USER MESSAGE:** ${message}
        
        Provide helpful, accurate, and context-aware responses that guide users to the right resources and information on TechConnect.`;

        // Generate response
        const result = await model.generateContent(systemPrompt);
        const response = result.response;
        const botResponse = response.text();

        // Log the interaction (you might want to store this in a database)
        const userId = req.user ? req.user._id : 'anonymous';
        console.log(`Chat interaction - User: ${userId}, Message: ${message}, Response: ${botResponse}`);

        return res.json({ 
            response: botResponse
        });

    } catch (error) {
        console.error('Chatbot controller error:', error);
        
        // Fallback response when API fails
        const fallbackResponse = "I apologize, but I'm having trouble connecting to my AI service right now. Please try again later or contact support if the issue persists.";
        
        return res.status(500).json({ 
            response: fallbackResponse
        });
    }
};

module.exports = {
    chatWithBot
};