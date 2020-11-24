import * as mailchimpMarketing from '@mailchimp/mailchimp_marketing'
import * as md5 from 'md5'
import * as fs from 'fs'
import * as unified from 'unified'
import * as markdown from 'remark-parse'
import * as remark2rehype from 'remark-rehype'
import * as html from 'rehype-stringify'
import { VFile } from 'vfile'
import { Service } from 'typedi'
import { ParamsConfig } from '../../config'
import { LeadSubscriberOptions, LeadSubscriberInterface } from './interfaces'

const newslettersPath = `${__dirname}/../../../../../docs/newsletters`

declare namespace Mailchimp {
  interface CampaignFolder {
    id: string
    name: string
  }

  interface CampaignFolders {
    folders: Array<CampaignFolder>
    total_items: number
  }

  interface Campaign {
    id: string
    web_id: number
    type: "regular"|"plaintext"|"absplit"|"rss"|"variate"
    create_time: string
    archive_url: string
    long_archive_url: string
    status: "save"|"paused"|"schedule"|"sending"|"sent"
    content_type: "template"|"html"|"url"|"multichannel"
    needs_block_refresh: boolean
    resendable: boolean
    recipients: {
      list_id: string
      list_is_active: boolean
      list_name: string
      segment_text: string
      recipient_count: number
    }
    settings: {
      title: string
      use_conversation: boolean
      to_name: string
      folder_id: string
      authenticate: boolean
      auto_footer: boolean
      inline_css: boolean
      auto_tweet: boolean
      fb_comments: boolean
      timewarp: boolean
      template_id: number
      drag_and_drop: boolean
    }
    tracking: {
      opens: boolean
      html_clicks: boolean
      text_clicks: boolean
      goal_tracking: boolean
      ecomm360: boolean
      google_analytics: string
      clicktale: string
    }
  }

  interface Campaigns {
    campaigns: Array<Campaign>
    total_items: number
  }
  interface TemplateFolder {
    id: string
    name: string
  }

  interface TemplateFolders {
    folders: Array<TemplateFolder>
    total_items: number
  }

  interface Template {
    id: number,
    type: string,
    name: string,
    drag_and_drop: boolean,
    responsive: boolean,
    category: string,
    date_created: string,
    date_edited: string,
    created_by: string,
    edited_by: string,
    active: boolean,
    folder_id: string,
    thumbnail: string,
    share_url: string,
  }

  interface Templates {
    templates: Array<Template>
    total_items: number
  }

  interface Automation {
    id: string
    create_time: string
    start_time: string
    status: "save"|"paused"|"sending"
    emails_sent: number
    recipients: {
      list_id: string,
      list_is_active: boolean,
      list_name: string
    }
    settings: {
      title: string,
      from_name: string,
      reply_to: string,
      use_conversation: boolean,
      to_name: string,
      authenticate: boolean,
      auto_footer: boolean,
      inline_css: boolean
    }
    tracking: {
      opens: boolean,
      html_clicks: boolean,
      text_clicks: boolean,
      goal_tracking: boolean,
      ecomm360: boolean,
      google_analytics: string,
      clicktale: string
    }
    trigger_settings: {
      workflow_type: string,
      workflow_title: string,
      runtime: {},
      workflow_emails_count: number
    }
    report_summary: {
      opens: number,
      unique_opens: number,
      open_rate: number,
      clicks: number,
      subscriber_clicks: number,
      click_rate: number
    }
  }

  interface Automations {
    automations: Array<Automation>
    total_items: number
  }

  interface Email {
    id: string,
    web_id: number,
    workflow_id: string,
    position: number,
    delay: {
      amount: number,
      type: string,
      direction: string,
      action: string,
      action_description: string,
      full_description: string
    },
    create_time: string,
    start_time: string,
    archive_url: string,
    status: "save"|"paused"|"sending",
    emails_sent: number,
    send_time: string,
    content_type: string,
    needs_block_refresh: boolean,
    has_logo_merge_tag: boolean,
    recipients: {
      list_id: string,
      list_is_active: boolean,
      list_name: string,
      segment_text: string,
      recipient_count: number,
      segment_opts: { saved_segment_id: number, match: string, conditions: Array<any> }
    },
    settings: {
      subject_line: string,
      preview_text: string,
      title: string,
      from_name: string,
      reply_to: string,
      authenticate: boolean,
      auto_footer: boolean,
      inline_css: boolean,
      auto_tweet: boolean,
      fb_comments: boolean,
      template_id: number,
      drag_and_drop: boolean
    },
    tracking: {
      opens: boolean,
      html_clicks: boolean,
      text_clicks: boolean,
      goal_tracking: boolean,
      ecomm360: boolean,
      google_analytics: string,
      clicktale: string
    },
    trigger_settings: {
      workflow_type: string,
      workflow_title: string,
      runtime: { days: Array<any>, hours: Object },
      workflow_emails_count: number
    },
    report_summary: {
      opens: number,
      unique_opens: number,
      open_rate: number,
      clicks: number,
      subscriber_clicks: number,
      click_rate: number
    },
  }

  interface Emails {
    emails: Array<Email>
    total_items: number
  }
}

@Service()
export default class MailchimpLeadSubscriber implements LeadSubscriberInterface {
  private mailchimp: any
  private listId: string
  private env: 'development'|'preprod'|'production'|'test'

  constructor(
    private paramsConfig: ParamsConfig,
  ) {
    mailchimpMarketing.setConfig({
      apiKey: paramsConfig.getConfig().get('mailchimp.apiKey'),
      server: paramsConfig.getConfig().get('mailchimp.serverPrefix'),
    })
    this.mailchimp = mailchimpMarketing
    this.listId = this.paramsConfig.getConfig().get('mailchimp.listId')
    this.env = this.paramsConfig.getConfig().get('env')
  }

  public async subscribe(email: string, options: LeadSubscriberOptions): Promise<any> {
    const subscriberHash = md5(email.toLowerCase())

    await this.mailchimp.lists.setListMember(this.listId, subscriberHash, {
      email_address: email,
      status_if_new: "subscribed",
    })

    const body: any = { tags: [] }

    if (options.type === 'newsletter') {
      body.tags.push({
        name: "uniflow-newsletter",
        status: "active",
      })
    }

    await this.mailchimp.lists.updateListMemberTags(this.listId, subscriberHash, { body })
  }
  
  private async getCampaignFolders(options?: {count?: number, offset?: number}): Promise<Array<Mailchimp.CampaignFolder>> {
    const folders: Array<Mailchimp.CampaignFolder> = []
    let items: Mailchimp.CampaignFolders

    do {
      options = options ?? {}
      options.count = options.count ?? 10
      options.offset = options.offset ?? 0

      items = await this.mailchimp.campaignFolders.list(options)
      for(const item of items.folders) {
        folders.push(item)
      }
      options.offset += 10
    } while(items.total_items > folders.length)

    return folders
  }
  
  private async getCampaigns(options?: {count?: number, offset?: number, folder_id?: string}): Promise<Array<Mailchimp.Campaign>> {
    const campaigns: Array<Mailchimp.Campaign> = []
    let items: Mailchimp.Campaigns

    do {
      options = options ?? {}
      options.count = options.count ?? 10
      options.offset = options.offset ?? 0

      items = await this.mailchimp.campaigns.list(options)
      for(const item of items.campaigns) {
        campaigns.push(item)
      }
      options.offset += 10
    } while(items.total_items > campaigns.length)

    return campaigns
  }
  
  private async getTemplateFolders(options?: {count?: number, offset?: number}): Promise<Array<Mailchimp.TemplateFolder>> {
    const folders: Array<Mailchimp.TemplateFolder> = []
    let items: Mailchimp.TemplateFolders

    do {
      options = options ?? {}
      options.count = options.count ?? 10
      options.offset = options.offset ?? 0

      items = await this.mailchimp.templateFolders.list(options)
      for(const item of items.folders) {
        folders.push(item)
      }
      options.offset += 10
    } while(items.total_items > folders.length)

    return folders
  }
  
  private async getTemplates(options?: {count?: number, offset?: number, folder_id?: string}): Promise<Array<Mailchimp.Template>> {
    const templates: Array<Mailchimp.Template> = []
    let items: Mailchimp.Templates

    do {
      options = options ?? {}
      options.count = options.count ?? 10
      options.offset = options.offset ?? 0

      items = await this.mailchimp.templates.list(options)
      for(const item of items.templates) {
        templates.push(item)
      }
      options.offset += 10
    } while(items.total_items > templates.length)

    return templates
  }
  
  private async getAutomations(options?: {count?: number, offset?: number}): Promise<Array<Mailchimp.Automation>> {
    const automations: Array<Mailchimp.Automation> = []
    let items: Mailchimp.Automations

    do {
      options = options ?? {}
      options.count = options.count ?? 10
      options.offset = options.offset ?? 0

      items = await this.mailchimp.automations.list(options)
      for(const item of items.automations) {
        automations.push(item)
      }
      options.offset += 10
    } while(items.total_items > automations.length)

    return automations
  }
  
  private async getEmails(workflow_id: string): Promise<Array<Mailchimp.Email>> {
    const items: Mailchimp.Emails = await await this.mailchimp.automations.listAllWorkflowEmails(workflow_id)
    return items.emails
  }

  public async sync(): Promise<any> {
    // grab markdown newsletters headers and content
    const newsletters: any = await Promise.all(fs
      .readdirSync(newslettersPath).filter(file => {
        return fs.existsSync(`${newslettersPath}/${file}/index.md`)
      }).map(file => {
        return fs.readFileSync(`${newslettersPath}/${file}/index.md`, 'utf8')
      }).map(markdownContent => {
        // custom markdown where we get only the content of markdown
        const extract = markdownContent.split('---')
        const headers = extract.slice(-2, -1).join('').split('\n')
        return {
          headers: {
            title: headers
              .filter(header => header.indexOf('title: ') === 0)
              .map(header => header.slice(7))
              .join('')
              .trim(),
            date: headers
              .filter(header => header.indexOf('date: ') === 0)
              .map(header => header.slice(6))
              .join('')
              .trim(),
          },
          content: extract.slice(-1).join('').trim()
        }
      }).map((data) => {
        return new Promise(resolve => {
          const processor = unified().use(markdown).use(remark2rehype).use(html)
          processor.process(data.content, function (error, htmlContent: VFile) {
            if (error) throw error

            data.content = htmlContent.contents.toString()
            resolve(data)
          })
        })
      }))
    
    // create "uniflow-newsletter" folder in templates if missing
    const templateFolders: Array<Mailchimp.TemplateFolder> = await this.getTemplateFolders()
    const templateFolder: Mailchimp.TemplateFolder = templateFolders.filter((folder:any) => {
      return folder.name === 'uniflow-newsletter'
    }).shift() || await this.mailchimp.templateFolders.create({ name: "uniflow-newsletter" })

    const getIndexName = (index: number): string => {
      return `#${(index+1).toString().padStart(3, '0')}`
    }

    // sync templates
    const templatePrefixTitle = 'Uniflow Template Newsletter'
    const templates = (await this.getTemplates({folder_id: templateFolder.id}))
      .filter((template) => {
        return template.name.indexOf(templatePrefixTitle) === 0
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    
    for(let index = 0; index < newsletters.length; index++) {
      const indexName = getIndexName(index)
      const newletter = newsletters[index]
      const templateData = {
        name: `${templatePrefixTitle} ${indexName}`,
        html: newletter.content,
        folder_id: templateFolder.id,
      }

      let template = templates[index] ?? await this.mailchimp.templates.create(templateData)
      template = await this.mailchimp.templates.updateTemplate(template.id, templateData)
      templates[index] = template
    }

    // create "uniflow-newsletter" folder in campaigns if missing
    const campaignFolders: Array<Mailchimp.CampaignFolder> = await this.getCampaignFolders()
    const campaignFolder: Mailchimp.CampaignFolder = campaignFolders.filter((folder:any) => {
      return folder.name === 'uniflow-newsletter'
    }).shift() || await this.mailchimp.campaignFolders.create({ name: "uniflow-newsletter" })
    if(!campaignFolder) {
      throw new Error('Campaign folder "uniflow-newsletter" was not created')
    }

    //sync campaigns => we list all errors that have to manually get edited through mailchimp automation dashboard
    const errorMessages: Array<string> = []
    const automationPrefixTitle = 'Uniflow Automated Newsletter'
    const automations = (await this.getAutomations())
      .filter((automation) => {
        return automation.settings.title.indexOf(automationPrefixTitle) === 0
      }).sort((a, b) => {
        return a.settings.title.localeCompare(b.settings.title)
      })
    
    for(let index = 0; index < templates.length; index++) {
      const indexName = getIndexName(index)
      if(!automations[index] || automations[index].settings.title !== `${automationPrefixTitle} ${indexName}`) {
        errorMessages.push(`You must create a new Custom Automation titled "${automationPrefixTitle} ${indexName}"`)
        continue
      }

      const template = templates[index]
      const automation = automations[index]
      if(automation.settings.from_name !== 'Uniflow') {
        errorMessages.push(`${automation.settings.title} settings.from_name must be "Uniflow"`)
      }
      if(this.env === 'production' && automation.settings.reply_to !== 'contact@uniflow.io') {
        errorMessages.push(`${automation.settings.title} settings.reploy_to must be "contact@uniflow.io"`)
      }

      const emails = await this.getEmails(automation.id);
      if(emails.length !== 1) {
        errorMessages.push(`${automation.settings.title} must contain only one email`)
      }

      //await this.mailchimp.automations.pauseAllEmails(automation.id)
      for(const email of emails) {
        //await this.mailchimp.automations.pauseWorkflowEmail(automation.id, email.id)

        if(index === 0) {
          if(email.delay.type !== 'now') {
            errorMessages.push(`${automation.settings.title} email.delay.type !== now`)
          }
          if(email.delay.action !== 'signup') {
            errorMessages.push(`${automation.settings.title} email.delay.action !== signup`)
          }
        } else {
          if(email.delay.amount !== index) {
            errorMessages.push(`${automation.settings.title} email.delay.amount !== ${index}`)
          }
          if(email.delay.type !== 'day') {
            errorMessages.push(`${automation.settings.title} email.delay.type !== day`)
          }
          if(email.delay.direction !== 'after') {
            errorMessages.push(`${automation.settings.title} email.delay.direction !== after`)
          }
          if(email.delay.action !== 'signup') {
            errorMessages.push(`${automation.settings.title} email.delay.action !== signup`)
          }
        }

        if(email.recipients.list_id !== this.listId) {
          errorMessages.push(`${automation.settings.title} email.recipients.list_id !== ${this.listId}`)
        }
        if(email.recipients.segment_text.indexOf('Tags contact is tagged <strong>uniflow-newsletter</strong>') === -1) {
          errorMessages.push(`${automation.settings.title} email.recipients.segment_text not tagged "uniflow-newsletter"`)
        }

        const title = template.name.slice(0, 150)
        if(email.settings.subject_line !== title) {
          errorMessages.push(`${automation.settings.title} email.settings.subject_line !== "${title}"`)
        }
        if(email.settings.preview_text !== title) {
          errorMessages.push(`${automation.settings.title} email.settings.preview_text !== "${title}"`)
        }
        if(email.settings.title !== title) {
          errorMessages.push(`${automation.settings.title} email.settings.title !== "${title}"`)
        }
        if(email.settings.from_name !== "Uniflow") {
          errorMessages.push(`${automation.settings.title} email.settings.from_name !== "Uniflow"`)
        }
        if(email.settings.reply_to !== 'contact@uniflow.io' && this.env === 'production') {
          errorMessages.push(`${automation.settings.title} email.settings.reply_to !== "contact@uniflow.io"`)
        }
        if(email.settings.template_id !== template.id) {
          errorMessages.push(`${automation.settings.title} email.settings.template_id !== ${template.id}`)
        }
        
        /*await this.mailchimp.automations.updateWorkflowEmail(automation.id, email.id, {
          settings: {
            title: newletter.headers.title.slice(0, 150),
          },
        });*/

        //await this.mailchimp.automations.startWorkflowEmail(automation.id, email.id)
      }
      //await this.mailchimp.automations.startAllEmails(automation.id)
    }

    if(errorMessages.length > 0) {
      throw new Error(errorMessages.join('\n'))
    }
  }
}
