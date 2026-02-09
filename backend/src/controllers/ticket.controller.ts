import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Ticket from "../models/Ticket";
import { sendTicketEmail } from "../utils/emailService";
import { sendWhatsappMessage } from "../utils/whatsappService";
import { toZonedTime } from "date-fns-tz";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      cliente,
      empresa,
      cpf,
      cnpj,
      emailEmpresa,
      telefone,
      whatsapp,
      descricaoServico,
    } = req.body;
    const { companyId } = req.user as any;

    const notaServico = `NS-${Date.now()}`;
    const createdAt = new Date();

    const newTicket = new Ticket({
      cliente,
      empresa,
      cpf,
      cnpj,
      emailEmpresa,
      telefone,
      whatsapp,
      descricaoServico,
      notaServico,
      createdAt,
      companyId
    });

    const saved = await newTicket.save();

    const timeZone = "America/Sao_Paulo";
    const zonedDate = toZonedTime(createdAt, timeZone);

    const formattedDate = format(
      zonedDate,
      "'Data da Criação da Nota de Serviço:' dd/MM/yyyy 'no horário de' HH:mm",
      { locale: ptBR }
    );

    const lang = (req.body.lang || 'pt') as any;
    const { getTicketEmailTemplate } = await import('../utils/emailTemplates');
    
    const { subject, html } = getTicketEmailTemplate(lang, {
      cliente,
      empresa,
      cpf,
      cnpj,
      emailEmpresa,
      telefone,
      whatsapp,
      descricaoServico,
      notaServico,
      formattedDate
    });

    // Envia e-mail para o cliente
    if (emailEmpresa) {
      await sendTicketEmail(emailEmpresa, subject, html);
    }

    // Envia e-mail para o administrador (EMAIL_TO)
    if (process.env.EMAIL_TO) {
      const subjectAdmin = lang === 'pt' ? `Nova Nota de Serviço Criada - ${notaServico}` : (lang === 'en' ? `New Service Order Created - ${notaServico}` : `Nueva Orden de Servicio Creada - ${notaServico}`);
      await sendTicketEmail(process.env.EMAIL_TO, subjectAdmin, html);
    }

    // Envia WhatsApp
    if (whatsapp) {
      const mensagemWhatsapp = `
Tickytoria - Sua nota de serviço foi registrada com sucesso com os seguintes detalhes:

• Cliente: ${cliente}
• Empresa: ${empresa}
• CPF: ${cpf || "N/A"}
• CNPJ: ${cnpj || "N/A"}
• Telefone: ${telefone || "N/A"}
• WhatsApp: ${whatsapp || "N/A"}
• E-mail: ${emailEmpresa}
• Título: ${descricaoServico}
• Nota de Serviço: ${notaServico}
• Data: ${formattedDate}

Responderemos em breve!
      `;
      await sendWhatsappMessage(whatsapp, mensagemWhatsapp.trim());
    }

    res.status(201).json({ ...saved.toObject(), createdAt: formattedDate });
  } catch (err) {
    next(err);
  }
};
