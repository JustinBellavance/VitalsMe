# Vitals.me
### 1. Introduction                                        

 ![Logo](frontend/assest/Logo.png)


Inspired by bad personal experiences with long blood testing interpretation times and a serious lack of transparency into our own health, we built an extremely easy-to-use website which allows users to upload their own blood testing results and understand them **on their own time**. With stunning visuals and a friendly, safe and private chat function, users can ask any questions, anytime.

We built Vitals.me using a React-Flask software stack, which an customized OpenAI model as the chat bot.

Our main challenges involved ensuring a data privacy-first approach, being flexible with different types of blood result documentation and creating the most easy-to-understand interface and visualisations.

We're extremely proud to have a finished, polished product for users interested in better understanding their blood test results. To add, we're extremely happy to have a solid base of a project for the addition of more features down the line. With aspirations of adding functionality for genetic interpretation using a persons' personal genome, as well as helping reduce unnecessary doctor visits, we're looking forward to building the future of Vitals.me 

### 2. Installation and Setup

In order to run the code, run the frontend and backend seperatly, with node and python v3.12.* installed.
In one terminal : 
  >`cd frontend && npm install`

  >`npm run dev`

Then click on the localhost link in the terminal.

In the other :
  >`cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`

  >`flask --app app.py run`

NOTE: User must store their OpenAI API key in an .env file in the backend folder of the repository in order for the code to work properly. 

### 3. Features

Our app is designed to empower users with easy-to-understand visual representations of their blood test results and provide a private, personalized chatbot for real-time assistance. Here's how these features work:

a. Interactive Blood Test Visualization: 
  * users can upload their blood test results and the app automatically processes the data and generates clear, interactive chart that are simple to read. 
     
  * Visualization highlight key parameters, such as hemoglobin levels, potassium, iron and more, providing insights into whether these values fall within normal ranges. 
    
  * Our charts are Color-coded (e.g., green for normal, red for abnormal) to help users quickly identify areas of concern.

b. Private and Personalized Chatbot:

  * The app features a AI-powered chatbot that offers users a private (we do not share indentifiable information with the API) and safe way to explore their health concerns.
  * Users can prompt the chatbot to:
    - Ask questions about specific blood test results (e.g., "What does low hemoglobin mean?").
    - Request recommendations for lifestyle changes or dietary adjustments based on their results.
    - Gain a deeper understanding of medical terms and metrics in their report.
  * The chatbot is designed to be user-friendly and non-judgmental, helping to reduce anxiety and stress related to interpreting medical data.
  * It also provides follow-up options, such as explaining possible next steps users might take or questions to ask their doctor during a visit.

### 4. Limitations and Disclaimer

Vitals.me is a health information tool designed to assist users in interpreting their blood test results. While the app aims to make bloodwork easier to understand, it is important to emphasize its limitations and the situations in which users should seek professional medical advice.

#### No Medical Advice Disclaimer

Vitals.me is not a substitute for professional medical advice, diagnosis, or treatment. The app provides general insights and educational information based on uploaded blood test results. However, the interpretations are not tailored to individual medical histories, underlying conditions, or other unique factors that only a licensed healthcare provider can assess.

The app does not provide personalized medical recommendations or prescribe treatment plans.
The AI-powered chatbot is designed to answer general questions and explain medical concepts but is not capable of diagnosing or managing specific health conditions.

#### Disclaimer on Data Interpretation

Blood test results can vary due to lab equipment, methodologies, and reference ranges. Always cross-check insights provided by Vitals.me with your official lab report and a medical professional.
The app may not fully support all file formats, and inaccuracies can arise if data is uploaded in a non-standardized format or if the information is incomplete.


