const { spawn } = require('child_process');
const path = require('path');

const chatWithBot = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Sanitize the message to prevent command injection
        const sanitizedMessage = message.replace(/[;&|`$]/g, '');

        // Path to the Python script
        const scriptPath = path.join(__dirname, '../scripts/chatbot.py');

        // Spawn Python process
        const pythonProcess = spawn('python', [scriptPath, sanitizedMessage]);

        let responseData = '';
        let errorData = '';

        // Collect data from stdout
        pythonProcess.stdout.on('data', (data) => {
            responseData += data.toString();
        });

        // Collect data from stderr
        pythonProcess.stderr.on('data', (data) => {
            errorData += data.toString();
            console.error(`Python Error: ${data}`);
        });

        // Handle process completion
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python process exited with code ${code}`);
                console.error('Error data:', errorData);
                return res.status(500).json({ 
                    error: 'Error processing your request' 
                });
            }

            try {
                const response = JSON.parse(responseData);
                
                if (response.error) {
                    return res.status(500).json({ 
                        error: response.error 
                    });
                }

                // Log the interaction (you might want to store this in a database)
                console.log(`Chat interaction - User: ${req.user._id}, Message: ${sanitizedMessage}, Response: ${response.response}`);

                return res.json({ 
                    message: response.response 
                });

            } catch (error) {
                console.error('Error parsing Python response:', error);
                return res.status(500).json({ 
                    error: 'Error processing chatbot response' 
                });
            }
        });

    } catch (error) {
        console.error('Chatbot controller error:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

module.exports = {
    chatWithBot
}; 