import mailClient, { MailDataRequired } from "@sendgrid/mail";
mailClient.setApiKey(`${process.env.SENDGRID_API_KEY }`);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mailSend = (message: MailDataRequired): Promise<any> => {
  return new Promise((resolve, reject) => {
    mailClient
      .send(message)
      .then(([response]) => resolve(response.body))
      .catch((error) => reject(error));
  });
};
