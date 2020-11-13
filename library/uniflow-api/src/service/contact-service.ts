import { Inject, Service } from 'typedi';
import { ContactEntity } from '../entity';
import { ContactRepository } from '../repository';
import { MailerInterface } from './mailer/interfaces';

@Service()
export default class ContactService {
  constructor(
    private contactRepository: ContactRepository,
    @Inject('MailerInterface')
    private mailer: MailerInterface
  ) {}
  
  public async send(contact: ContactEntity): Promise<boolean> {
    return await this.mailer.send({
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
            color:#007bff;
            text-decoration:none;
        }
        a:hover {
            text-decoration: underline !important;
        }

        #content {
            background-image: url('https://api.uniflow.io/images/mail/content.jpg');
            background-repeat: repeat-y no-repeat;
            background-color: #007bff;
            margin: 0;
            padding: 0;
            width: 520px;
        }
    </style>

</head>
<body bgcolor="#FFFFFF" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0" style="-webkit-font-smoothing: antialiased;width:100% !important;background:#FFFFFF;-webkit-text-size-adjust:none;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
    <tr>
        <td bgcolor="#FFFFFF" width="100%">

            <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                    <td width="520" cellpadding="0" cellspacing="0" border="0" align="center">
                        <table id="content" width="520" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tr>
                                <td>
                                    <img src="https://api.uniflow.io/images/mail/header.jpg" alt="header" width="520" height="104" style="display: block; border: 0;">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="520" cellpadding="40" cellspacing="0" border="0">
                                        <tr>
                                            <td>
                                                <table cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td style="color:#6c757d;font-size:13px;font-family:Helvetica,Arial,sans-serif; line-height:12px;">
                                                            <span style="color:#007bff; font-size:20px; font-weight: 300;">Welcome Mathieu !</span><br /><br />
                                                        
                                                            A new contact form has been filled on Uniflow :<br /><br />
                                                            email : ${contact.email}<br />
                                                            contenu : ${contact.message}<br />
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr topmargin="40">
                                            <td style="color:#6c757d; font-size:10px; font-family:Helvetica,Arial,sans-serif; line-height:14px; text-align: center;">
                                                This is an automatic message from <a href="https://api.uniflow.io">Uniflow</a>.<br />
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
  }

  public async isValid(contact: ContactEntity): Promise<boolean> {
    return true
  }
}
