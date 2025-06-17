import re
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.layers import Input, LSTM, Dense
import json
import sys
import os

class MentalHealthChatbot:
    def __init__(self):
        # Load the model and necessary data
        self.model_path = os.path.join(os.path.dirname(__file__), 'models/training_model.h5')
        self.data_path = os.path.join(os.path.dirname(__file__), 'data/Happiness.csv')
        
        # Load the data and create necessary dictionaries
        self.load_data()
        self.load_model()
        
        # Chatbot settings
        self.negative_responses = ("no", "nope", "nah", "naw", "not a chance", "sorry")
        self.exit_commands = ("quit", "pause", "exit", "goodbye", "bye", "later", "stop")

    def load_data(self):
        try:
            # Read and preprocess the data
            data = pd.read_csv(self.data_path, encoding='ISO-8859-1')
            
            # Clean the data
            for i in range(data.shape[0]):
                data['Answer'][i] = re.sub(r'\n|\(|\)|,|-|/', ' ', data['Answer'][i])
            
            # Create pairs
            self.pairs = [(data['Questions'][i], data['Answer'][i]) for i in range(data.shape[0])]
            
            # Create input and target docs
            self.input_docs = []
            self.target_docs = []
            self.input_tokens = set()
            self.target_tokens = set()
            
            for line in self.pairs:
                input_doc, target_doc = line[0], line[1]
                self.input_docs.append(input_doc)
                
                target_doc = " ".join(re.findall(r"[\w']+|[^\s\w]", target_doc))
                target_doc = '<START> ' + target_doc + ' <END>'
                self.target_docs.append(target_doc)
                
                for token in re.findall(r"[\w']+|[^\s\w]", input_doc):
                    self.input_tokens.add(token)
                for token in target_doc.split():
                    self.target_tokens.add(token)
            
            # Create dictionaries
            self.input_tokens = sorted(list(self.input_tokens))
            self.target_tokens = sorted(list(self.target_tokens))
            self.input_features_dict = dict([(token, i) for i, token in enumerate(self.input_tokens)])
            self.target_features_dict = dict([(token, i) for i, token in enumerate(self.target_tokens)])
            self.reverse_input_features_dict = dict((i, token) for token, i in self.input_features_dict.items())
            self.reverse_target_features_dict = dict((i, token) for token, i in self.target_features_dict.items())
            
            # Calculate sequence lengths
            self.max_encoder_seq_length = max([len(re.findall(r"[\w']+|[^\s\w]", input_doc)) for input_doc in self.input_docs])
            self.max_decoder_seq_length = max([len(re.findall(r"[\w']+|[^\s\w]", target_doc)) for target_doc in self.target_docs])
            
            self.num_encoder_tokens = len(self.input_tokens)
            self.num_decoder_tokens = len(self.target_tokens)
            
        except Exception as e:
            print(f"Error loading data: {str(e)}", file=sys.stderr)
            raise

    def load_model(self):
        try:
            # Load the training model
            self.training_model = load_model(self.model_path)
            
            # Create encoder model
            encoder_inputs = self.training_model.input[0]
            encoder_outputs, state_h_enc, state_c_enc = self.training_model.layers[2].output
            encoder_states = [state_h_enc, state_c_enc]
            self.encoder_model = Model(encoder_inputs, encoder_states)
            
            # Create decoder model
            latent_dim = 256
            decoder_inputs = self.training_model.input[1]
            decoder_lstm = self.training_model.layers[3]
            decoder_dense = self.training_model.layers[5]
            
            decoder_state_input_hidden = Input(shape=(latent_dim,))
            decoder_state_input_cell = Input(shape=(latent_dim,))
            decoder_states_inputs = [decoder_state_input_hidden, decoder_state_input_cell]
            
            decoder_outputs, state_hidden, state_cell = decoder_lstm(
                decoder_inputs, initial_state=decoder_states_inputs)
            decoder_states = [state_hidden, state_cell]
            decoder_outputs = decoder_dense(decoder_outputs)
            
            self.decoder_model = Model(
                [decoder_inputs] + decoder_states_inputs,
                [decoder_outputs] + decoder_states
            )
            
        except Exception as e:
            print(f"Error loading model: {str(e)}", file=sys.stderr)
            raise

    def string_to_matrix(self, user_input):
        tokens = re.findall(r"[\w']+|[^\s\w]", user_input)
        user_input_matrix = np.zeros(
            (1, self.max_encoder_seq_length, self.num_encoder_tokens),
            dtype='float32'
        )
        for timestep, token in enumerate(tokens):
            if token in self.input_features_dict:
                user_input_matrix[0, timestep, self.input_features_dict[token]] = 1.
        return user_input_matrix

    def decode_response(self, test_input):
        try:
            states_value = self.encoder_model.predict(test_input, verbose=0)
            target_seq = np.zeros((1, 1, self.num_decoder_tokens))
            target_seq[0, 0, self.target_features_dict['<START>']] = 1.
            
            decoded_sentence = ''
            stop_condition = False
            
            while not stop_condition:
                output_tokens, hidden_state, cell_state = self.decoder_model.predict(
                    [target_seq] + states_value, verbose=0
                )
                
                sampled_token_index = np.argmax(output_tokens[0, -1, :])
                sampled_token = self.reverse_target_features_dict[sampled_token_index]
                decoded_sentence += " " + sampled_token
                
                if (sampled_token == '<END>' or 
                    len(decoded_sentence) > self.max_decoder_seq_length):
                    stop_condition = True
                
                target_seq = np.zeros((1, 1, self.num_decoder_tokens))
                target_seq[0, 0, sampled_token_index] = 1.
                states_value = [hidden_state, cell_state]
            
            return decoded_sentence.strip()
            
        except Exception as e:
            print(f"Error generating response: {str(e)}", file=sys.stderr)
            return "I apologize, but I'm having trouble processing your request right now."

    def generate_response(self, user_input):
        try:
            if any(exit_command in user_input.lower() for exit_command in self.exit_commands):
                return "Goodbye! Take care of yourself."
            
            if any(negative in user_input.lower() for negative in self.negative_responses):
                return "I understand. Is there anything else you'd like to talk about?"
            
            input_matrix = self.string_to_matrix(user_input)
            chatbot_response = self.decode_response(input_matrix)
            
            # Clean up the response
            chatbot_response = chatbot_response.replace("<START>", '').replace("<END>", '').strip()
            
            return chatbot_response if chatbot_response else "I'm not sure how to respond to that. Could you rephrase?"
            
        except Exception as e:
            print(f"Error in generate_response: {str(e)}", file=sys.stderr)
            return "I apologize, but I'm having trouble processing your request right now."

def main():
    try:
        # Get the user input from command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            sys.exit(1)
            
        user_input = sys.argv[1]
        chatbot = MentalHealthChatbot()
        response = chatbot.generate_response(user_input)
        
        # Return the response as JSON
        print(json.dumps({"response": response}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main() 