import { Resend } from "resend";
import { Request, Response } from "express";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req: Request, res: Response) => {
  try {
    // Parse the request body to get the form data
    const { name, email, phone, subject, message } = req.body;

    // Use Resend to send the email
    const { data, error } = await resend.emails.send({
      from: "TripTales India <contact@triptalesindia.in>", // Replace with your verified domain in production
      to: ["triptales02@gmail.com"], // The email you want to receive messages at
      subject: `New Inquiry: ${subject}`, // Use the subject from the form
      replyTo: email, // Set the user's email as the reply-to
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Handle potential errors from the Resend API
    if (error) {
      console.error("Resend API Error:", error);
      return res.status(500).json({ error: "Error sending email." });
    }

    // Return a success response
    return res.status(200).json({ message: "Email sent successfully!", data });
  } catch (error) {
    // Handle other errors (e.g., parsing request body)
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};
