import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending newsletter confirmation to:", email);

    const emailResponse = await resend.emails.send({
      from: "ED Sneakers <noreply@edsneakers.fr>",
      to: [email],
      subject: "Bienvenue dans la communauté ED Sneakers !",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue chez ED Sneakers</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">ED Sneakers</h1>
            <p style="color: #666; margin: 0;">Style & Qualité</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h2 style="margin-top: 0; margin-bottom: 15px;">Merci pour votre inscription !</h2>
            <p style="font-size: 18px; margin-bottom: 20px;">Bienvenue dans la communauté ED Sneakers</p>
            <p style="margin: 0;">Vous recevrez désormais nos dernières nouveautés et offres exclusives</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #2563eb; margin-bottom: 15px;">Ce qui vous attend :</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; top: 0; color: #2563eb;">✓</span>
                Accès prioritaire aux nouvelles collections
              </li>
              <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; top: 0; color: #2563eb;">✓</span>
                Promotions exclusives réservées aux abonnés
              </li>
              <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; top: 0; color: #2563eb;">✓</span>
                Conseils mode et tendances sneakers
              </li>
              <li style="margin-bottom: 10px; padding-left: 25px; position: relative;">
                <span style="position: absolute; left: 0; top: 0; color: #2563eb;">✓</span>
                Codes promo personnalisés
              </li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://edsneakers.fr" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold;">
              Découvrir nos Collections
            </a>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>Vous recevez cet email car vous vous êtes inscrit à notre newsletter.</p>
            <p>
              <a href="#" style="color: #2563eb; text-decoration: none;">Se désabonner</a> | 
              <a href="#" style="color: #2563eb; text-decoration: none;">Gérer mes préférences</a>
            </p>
            <p style="margin-bottom: 0;">© 2024 ED Sneakers. Tous droits réservés.</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Newsletter confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email de confirmation envoyé avec succès",
      data: emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in newsletter confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Erreur lors de l'envoi de l'email",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);