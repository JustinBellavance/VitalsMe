## Vitals.me

Inspired by bad personal experiences with long blood testing interpretation times and a serious lack of transparency into our own health, we built an extremely easy-to-use website which allows users to upload their own blood testing results and understand them **on their own time**. With stunning visuals and a friendly, safe and private chat function, users can ask any questions, anytime.

We built Vitals.me using a React-Flask software stack, which an customized OpenAI model as the chat bot.

Our main challenges involved ensuring a data privacy-first approach, being flexible with different types of blood result documentation and creating the most easy-to-understand interface and visualisations.

We're extremely proud to have a finished, polished product for users interested in better understanding their blood test results. To add, we're extremely happy to have a solid base of a project for the addition of more features down the line. With aspirations of adding functionality for genetic interpretation using a persons' personal genome, as well as helping reduce unnecessary doctor visits, we're looking forward to building the future of Vitals.me 

In order to run the code, run the frontend and backend seperatly, with node and python v3.12.* installed.
In one terminal : 
  >`cd frontend && npm install`
  >`npm run dev`

Then click on the localhost link in the terminal.

In the other :
  >`cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
  >`flask --app app.py run`

