import * as nodemailer from 'nodemailer'
import { Service, Inject } from 'typedi';
import { Repository, getRepository } from 'typeorm';
import { Contact } from '../models';
import config from '../config'

@Service()
export default class ContactService {
  private contactRepository: Repository<Contact>;

  constructor(
    @Inject(type => Contact) contact: Contact
  ) {
    this.contactRepository = getRepository(Contact)
  }
  
  public async save(contact: Contact): Promise<Contact> {
    return await this.contactRepository.save(contact);
  }

  public async findOne(id?: string | number): Promise<Contact | undefined> {
    return await this.contactRepository.findOne(id);
  }
  
  public async send(contact: Contact): Promise<boolean> {
    const smtpTransporter = nodemailer.createTransport(config.get('mailerUrl'));
    await smtpTransporter.sendMail({
      from: 'no-reply@uniflow.io',
      to: 'matyo@uniflow.io',
      subject: '[Uniflow] Contact',
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">

<html lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Uniflow</title>

    <style>
        td a {
            color:#CCCCCC;
            text-decoration:none;
        }
        a:hover {
            text-decoration: underline !important;
        }

        #content {
            background-image: url('https://uniflow.io/images/mail/content.jpg');
            background-repeat: repeat-y no-repeat;
            background-color: #202020;
            margin: 0;
            padding: 0;
            width: 520px;
        }

    </style>

</head>
<body bgcolor="#000000" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0" style="-webkit-font-smoothing: antialiased;width:100% !important;background:#000000;-webkit-text-size-adjust:none;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000">
    <tr>
        <td bgcolor="#000000" width="100%">

            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                    <td width="520" cellpadding="0" cellspacing="0" border="0" align="center">
                        <table id="content" width="520" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr>
                                <td>
                                    <img src="https://uniflow.io/images/mail/header.jpg" alt="header" width="520" height="104" style="display: block; border: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="520" cellpadding="40" cellspacing="0" border="0">
                                        <tr>
                                            <td>
                                                <table cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td style="color:#808080;font-size:13px;font-family:Helvetica,Arial,sans-serif; line-height:12px;">
                                                            <span style="color:#EEEEEE; font-size:20px; font-weight: 300;">Welcome Mathieu !</span><br /><br />
                                                        
                                                            A new contact form has been filled on Uniflow :<br /><br />
                                                            email : ${contact.email}<br />
                                                            contenu : ${contact.message}<br />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr topmargin="40">
                                            <td style="color:#808080; font-size:10px; font-family:Helvetica,Arial,sans-serif; line-height:14px; text-align: center;">
                                                This is an automatic message from <a href="https://uniflow.io">Uniflow</a>.<br />
                                                Do not respond.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

</body>
</html>`
    })
    
    return true;
  }

  public async isValid(contact: Contact): Promise<boolean> {
    return true
  }
}
