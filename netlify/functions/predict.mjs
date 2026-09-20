
export const handler = async (event) => {
   if (event.httpMethod !== "POST") {
      return {
         statusCode: 405,
         body: JSON.stringify({
            error: "Only POST requests are allowed"
         })
      };
   }

   try {
      const body = JSON.parse(event.body || "{}");
      const question = (body.text || body.question || "")
         .toLowerCase()
         .trim();

      if (!question) {
         return {
            statusCode: 400,
            body: JSON.stringify({
               error: "Question is required"
            })
         };
      }

      let answer = "";
      let confidence = 0.85;

      if (
         question.includes("headache") ||
         question.includes("head pain")
      ) {
         answer =
            "Headache can have different causes. Rest, drink enough water, and monitor your symptoms. If the headache is sudden, severe, or accompanied by weakness, confusion, or vision problems, seek urgent medical care.";
      } else if (
         question.includes("fever") ||
         question.includes("temperature")
      ) {
         answer =
            "Fever can occur with infections and other conditions. Drink fluids and monitor your temperature. Seek medical advice if the fever is high, persistent, or accompanied by serious symptoms.";
      } else if (
         question.includes("cough") ||
         question.includes("cold")
      ) {
         answer =
            "Cough and cold symptoms can have several causes. Rest and drink fluids. Consult a healthcare professional if symptoms are severe, persistent, or you have breathing difficulty.";
      } else if (
         question.includes("skin rash") ||
         question.includes("itching") ||
         question.includes("rash")
      ) {
         answer =
            "Skin rash and itching can have different causes, including irritation or allergy. Avoid possible irritants and do not scratch the area. Seek medical advice if the rash spreads, becomes painful, or is associated with breathing difficulty.";
      } else if (
         question.includes("diabetes") ||
         question.includes("blood sugar")
      ) {
         answer =
            "Diabetes requires appropriate blood glucose monitoring and medical guidance. A healthcare professional can help with testing, diet, medicines, and treatment planning.";
      } else if (
         question.includes("anxiety") ||
         question.includes("stress")
      ) {
         answer =
            "If you are feeling anxious or stressed, try slow breathing and speak with someone you trust. If symptoms are persistent or affecting daily life, consider speaking with a qualified mental health professional.";
      } else if (
         question.includes("emergency") ||
         question.includes("chest pain") ||
         question.includes("difficulty breathing")
      ) {
         answer =
            "This may require urgent medical attention. Contact your local emergency service or go to the nearest emergency department.";
         confidence = 0.95;
      } else if (
         question.includes("your name") ||
         question.includes("who are you")
      ) {
         answer =
            "My name is Smily. I am a healthcare information chatbot. I provide general information, not a medical diagnosis.";
         confidence = 1;
      } else {
         answer =
            "I could not find a matching healthcare topic. Please describe your symptoms clearly, or consult a qualified healthcare professional for personalized medical advice.";
         confidence = 0.35;
      }

      return {
         statusCode: 200,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            answer,
            confidence,
            status: "success"
         })
      };
   } catch (error) {
      return {
         statusCode: 400,
         body: JSON.stringify({
            error: "Invalid request"
         })
      };
   }
};
export const handler = async (event) => {
   if (event.httpMethod !== "POST") {
      return {
         statusCode: 405,
         body: JSON.stringify({
            error: "Only POST requests are allowed"
         })
      };
   }

   try {
      const body = JSON.parse(event.body || "{}");
      const question = (body.text || body.question || "")
         .toLowerCase()
         .trim();

      if (!question) {
         return {
            statusCode: 400,
            body: JSON.stringify({
               error: "Question is required"
            })
         };
      }

      let answer = "";
      let confidence = 0.85;

      if (
         question.includes("headache") ||
         question.includes("head pain")
      ) {
         answer =
            "Headache can have different causes. Rest, drink enough water, and monitor your symptoms. If the headache is sudden, severe, or accompanied by weakness, confusion, or vision problems, seek urgent medical care.";
      } else if (
         question.includes("fever") ||
         question.includes("temperature")
      ) {
         answer =
            "Fever can occur with infections and other conditions. Drink fluids and monitor your temperature. Seek medical advice if the fever is high, persistent, or accompanied by serious symptoms.";
      } else if (
         question.includes("cough") ||
         question.includes("cold")
      ) {
         answer =
            "Cough and cold symptoms can have several causes. Rest and drink fluids. Consult a healthcare professional if symptoms are severe, persistent, or you have breathing difficulty.";
      } else if (
         question.includes("skin rash") ||
         question.includes("itching") ||
         question.includes("rash")
      ) {
         answer =
            "Skin rash and itching can have different causes, including irritation or allergy. Avoid possible irritants and do not scratch the area. Seek medical advice if the rash spreads, becomes painful, or is associated with breathing difficulty.";
      } else if (
         question.includes("diabetes") ||
         question.includes("blood sugar")
      ) {
         answer =
            "Diabetes requires appropriate blood glucose monitoring and medical guidance. A healthcare professional can help with testing, diet, medicines, and treatment planning.";
      } else if (
         question.includes("anxiety") ||
         question.includes("stress")
      ) {
         answer =
            "If you are feeling anxious or stressed, try slow breathing and speak with someone you trust. If symptoms are persistent or affecting daily life, consider speaking with a qualified mental health professional.";
      } else if (
         question.includes("emergency") ||
         question.includes("chest pain") ||
         question.includes("difficulty breathing")
      ) {
         answer =
            "This may require urgent medical attention. Contact your local emergency service or go to the nearest emergency department.";
         confidence = 0.95;
      } else if (
         question.includes("your name") ||
         question.includes("who are you")
      ) {
         answer =
            "My name is Smily. I am a healthcare information chatbot. I provide general information, not a medical diagnosis.";
         confidence = 1;
      } else {
         answer =
            "I could not find a matching healthcare topic. Please describe your symptoms clearly, or consult a qualified healthcare professional for personalized medical advice.";
         confidence = 0.35;
      }

      return {
         statusCode: 200,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            answer,
            confidence,
            status: "success"
         })
      };
   } catch (error) {
      return {
         statusCode: 400,
         body: JSON.stringify({
            error: "Invalid request"
         })
      };
   }
};