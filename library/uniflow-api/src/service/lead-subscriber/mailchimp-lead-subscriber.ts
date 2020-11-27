import * as mailchimpMarketing from '@mailchimp/mailchimp_marketing'
import * as md5 from 'md5'
import * as fs from 'fs'
import * as unified from 'unified'
import * as path from 'path'
import * as markdown from 'remark-parse'
import * as remark2rehype from 'remark-rehype'
import * as html from 'rehype-stringify'
import { Transformer } from "unified";
import { Node, Parent } from "unist";
import { VFile, VFileCompatible } from 'vfile'
import { Service } from 'typedi'
import { ParamsConfig } from '../../config'
import { LeadSubscriberInterface } from './interfaces'
import { LeadEntity } from '../../entity'

const newslettersPath = `${__dirname}/../../../../../docs/newsletters`

declare namespace Mailchimp {

  interface MergeField {
    merge_id: number,
    tag: string,
    name: string,
    type: string,
    required: boolean,
    default_value: string,
    public: boolean,
    display_order: number,
  }

  interface MergeFields {
    merge_fields: Array<MergeField>
    total_items: number
  }

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
      subject_line: string
      title: string
      from_name: string
      reply_to: string
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
    rss_opts: {
      feed_url: string,
      frequency: 'daily',
      schedule: {
        hour: number,
        daily_send: Object,
        weekly_send_day: string,
        monthly_send_date: number
      },
      last_sent: string,
      constrain_rss_img: boolean
    },
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

  public async update(lead: LeadEntity): Promise<any> {
    const subscriberHash = md5(lead.email.toLowerCase())

    await this.mailchimp.lists.setListMember(this.listId, subscriberHash, {
      email_address: lead.email,
      status_if_new: "subscribed",
      merge_fields: {
        LEAD_ID: lead.uid,
      }
    })

    await this.mailchimp.lists.updateListMemberTags(this.listId, subscriberHash, {
      tags: [{
        name: "uniflow-newsletter",
        status: lead.optinNewsletter ? "active" : "inactive",
      }, {
        name: "uniflow-blog",
        status: lead.optinBlog ? "active" : "inactive",
      }]
    })
  }
  
  private async getMergeFields(listId: string, options?: {count?: number, offset?: number}): Promise<Array<Mailchimp.MergeField>> {
    const mergeFields: Array<Mailchimp.MergeField> = []
    let items: Mailchimp.MergeFields

    do {
      options = options ?? {}
      options.count = options.count ?? 10
      options.offset = options.offset ?? 0

      items = await this.mailchimp.lists.getListMergeFields(listId, options)
      for(const item of items.merge_fields) {
        mergeFields.push(item)
      }
      options.offset += 10
    } while(items.total_items > mergeFields.length)

    return mergeFields
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

  private imagesInline(): Transformer {
    const transformer = async (node: Node, file: VFile): Promise<Node> => {
      if (!file.path) {
        return node
      }

      if (node.type === 'image' && node.url && /\.png$/.test(node.url as string)) {
        let imagePath = path.resolve(file.dirname!, node.url as string);
        var bitmap = fs.readFileSync(imagePath);
        const base64 = Buffer.from(bitmap).toString('base64');
        node.url = `data:image/png;base64,${base64}`
      } else if (node.type === 'image' && node.url && /\.jpg$/.test(node.url as string)) {
        let imagePath = path.resolve(file.dirname!, node.url as string);
        var bitmap = fs.readFileSync(imagePath);
        const base64 = Buffer.from(bitmap).toString('base64');
        node.url = `data:image/jpg;base64,${base64}`
      } else if (node.type === 'image' && node.url && /\.gif$/.test(node.url as string)) {
        let imagePath = path.resolve(file.dirname!, node.url as string);
        var bitmap = fs.readFileSync(imagePath);
        const base64 = Buffer.from(bitmap).toString('base64');
        node.url = `data:image/gif;base64,${base64}`
      }
    
      if (node.children) {
        let parent = node as Parent;
        for (let child of parent.children) {
          transformer(child, file)
        }
      }
    
      return node;
    }

    return transformer
  }

  /**
   * this :
   * - add "lead_id" merge field if missing
   */
  private async syncMergeFields(): Promise<any> {
    // create "lead_id" merge field in audience list if missing
    const mergeFields: Array<Mailchimp.MergeField> = await this.getMergeFields(this.listId)
    const mergeField: Mailchimp.MergeField = mergeFields.filter((mergeField:any) => {
      return mergeField.name === 'lead_id'
    }).shift() || await this.mailchimp.lists.addListMergeField(this.listId, { name: "lead_id", type: "text", tag:"LEAD_ID" })
    if(!mergeField) {
      throw new Error('MergeField "lead_id" was not created')
    }

    await this.mailchimp.lists.updateListMergeField(this.listId, mergeField.merge_id, { name: "lead_id", type: "text", tag:"LEAD_ID" })
  }

  private async processMailchimpMarkdown(vFile: VFileCompatible): Promise<string> {
    return new Promise(resolve => {
      const processor = unified().use(markdown).use(this.imagesInline).use(remark2rehype).use(html)
      processor.process(vFile, function (error, htmlContent: VFile) {
        if (error) throw error

        htmlContent.contents = htmlContent.contents.toString()
          .replace(/LEAD_ID/g, '*|LEAD_ID|*')
          .replace(/RSSFEED\:TITLE/g, '*|RSSFEED:TITLE|*')
          .replace(/RSSFEED\:URL/g, '*|RSSFEED:URL|*')
          .replace(/RSSITEM\:CONTENT/g, '*|RSSITEM:CONTENT|*')
        
        resolve(htmlContent.contents)
      })
    })
  }

  /**
   * this :
   * - read markdowns newsletters and create associated templates
   * - check automations associated to the newsletters and report config errors
   */
  private async syncNewsletters(): Promise<any> {
    // grab markdown newsletters headers and content
    const newsletters: any = await Promise.all(fs
      .readdirSync(newslettersPath).filter(file => {
        const path = `${newslettersPath}/${file}/index.md`
        return fs.existsSync(path)
      }).map((file) => {
        const dirname = `${newslettersPath}/${file}`
        const path = `${dirname}/index.md`
        return {file, dirname, path, content: fs.readFileSync(path, 'utf8')}
      }).map(({file, dirname, path, content}) => {
        // custom markdown where we get only the content of markdown
        const extract = content.split('---')
        const extractField = (headers: Array<string>, name: string): string => {
          return headers
          .filter(header => header.indexOf(`${name}: `) === 0)
          .map(header => header.slice(name.length + 2))
          .join('')
          .trim()
        }
        const headers = extract.slice(-2, -1).join('').split('\n')
        return {
          headers: {
            title: extractField(headers, 'title'),
            date: extractField(headers, 'date'),
            index: extractField(headers, 'index'),
            file,
            dirname,
            path,
          },
          content: extract.slice(-1).join('').trim()
        }
      }).map(async (data) => {
        data.content = await this.processMailchimpMarkdown({
          path: data.headers.path,
          dirname: data.headers.dirname,
          contents: [
            `# ${data.headers.title}`,
            '',
            data.content,
            '',
            '[https://uniflow.io](https://uniflow.io) - [Github](https://github.com/uniflow-io/uniflow) - [Twitter](https://twitter.com/uniflow_io)',
            '',
            `[View this email in your browser](https://uniflow.io/newsletters/${data.headers.file})`,
            '',
            `[Unsubscribe](https://uniflow.io/notifications/unsubscribe?id=LEAD_ID) - [Manage your subscriptions](https://uniflow.io/notifications/manage?id=LEAD_ID)`,
          ].join('\n'),
        })

        return data
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
    const templatePrefixTitle = 'Uniflow Newsletter'
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
        name: `${templatePrefixTitle} ${indexName} ${newletter.headers.title}`.slice(0, 50),
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
      const newletter = newsletters[index]
      if(automation.status !== 'sending') {
        errorMessages.push(`${automation.settings.title} status must be "sending"`)
      }
      if(automation.settings.from_name !== 'Uniflow') {
        errorMessages.push(`${automation.settings.title} settings.from_name must be "Uniflow"`)
      }
      if(automation.settings.reply_to !== 'contact@uniflow.io' && this.env === 'production') {
        errorMessages.push(`${automation.settings.title} settings.reploy_to must be "contact@uniflow.io"`)
      }
      if(automation.recipients.list_id !== this.listId) {
        errorMessages.push(`${automation.settings.title} recipients.list_id !== ${this.listId}`)
      }

      const emails = await this.getEmails(automation.id);
      if(emails.length !== 1) {
        errorMessages.push(`${automation.settings.title} must contain only one email`)
      }

      //await this.mailchimp.automations.pauseAllEmails(automation.id)
      for(const email of emails) {
        //await this.mailchimp.automations.pauseWorkflowEmail(automation.id, email.id)

        if(email.status !== 'sending') {
          errorMessages.push(`${automation.settings.title} email.status !== sending`)
        }

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

        const title = newletter.headers.title.slice(0, 150)
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

  /**
   * this :
   * - create blog template
   * - check automation associated to the blog template and report config errors
   */
  public async syncBlog(): Promise<any> {
    // grab markdown newsletters headers and content
    const blog: any = await Promise.resolve({
        headers: {
          title: 'RSSFEED:TITLE',
          date: null,
        },
        content: 'RSSITEM:CONTENT'
      })
      .then(async (data) => {
        data.content = await this.processMailchimpMarkdown({
          contents: [
            `# ${data.headers.title}`,
            '',
            data.content,
            '',
            '[https://uniflow.io](https://uniflow.io) - [Github](https://github.com/uniflow-io/uniflow) - [Twitter](https://twitter.com/uniflow_io)',
            '',
            `[View this email in your browser](RSSFEED:URL)`,
            '',
            `[Unsubscribe](https://uniflow.io/notifications/unsubscribe?id=LEAD_ID) - [Manage your subscriptions](https://uniflow.io/notifications/manage?id=LEAD_ID)`,
          ].join('\n'),
        })
        
        return data
      })

    // create "uniflow-newsletter" folder in templates if missing
    const templateFolders: Array<Mailchimp.TemplateFolder> = await this.getTemplateFolders()
    const templateFolder: Mailchimp.TemplateFolder = templateFolders.filter((folder:any) => {
      return folder.name === 'uniflow-blog'
    }).shift() || await this.mailchimp.templateFolders.create({ name: "uniflow-blog" })

    // sync templates
    const templateTitle = 'Uniflow Blog'
    let template = (await this.getTemplates({folder_id: templateFolder.id}))
      .filter((template) => {
        return template.name === templateTitle
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      .shift()
    
    const templateData = {
      name: `${templateTitle}`.slice(0, 50),
      html: blog.content,
      folder_id: templateFolder.id,
    }
    
    template = template ?? await this.mailchimp.templates.create(templateData)
    if(!template) {
      throw new Error(`template ${templateTitle} was not created`)
    }
    template = await this.mailchimp.templates.updateTemplate(template.id, templateData)
    if(!template) {
      throw new Error(`template ${templateTitle} was not created`)
    }

    // create "uniflow-blog" folder in campaigns if missing
    const campaignFolders: Array<Mailchimp.CampaignFolder> = await this.getCampaignFolders()
    const campaignFolder: Mailchimp.CampaignFolder = campaignFolders.filter((folder:any) => {
      return folder.name === 'uniflow-blog'
    }).shift() || await this.mailchimp.campaignFolders.create({ name: "uniflow-blog" })
    if(!campaignFolder) {
      throw new Error('Campaign folder "uniflow-blog" was not created')
    }

    const errorMessages: Array<string> = []
    const campaignTitle = 'Uniflow Automated Blog'
    const campaign = (await this.getCampaigns())
      .filter((campaign) => {
        return campaign.settings.title === campaignTitle
      })
      .shift()
    
    if(!campaign) {
      throw new Error(`You must create a new RSS Campaign titled "${campaignTitle}"`)
    }

    if(campaign.type !== 'rss') {
      errorMessages.push(`${campaign.settings.title} type must be "rss"`)
    }

    if(campaign.status !== 'sending') {
      errorMessages.push(`${campaign.settings.title} status must be "sending"`)
    }

    if(campaign.content_type !== 'template') {
      errorMessages.push(`${campaign.settings.title} status must be "template"`)
    }

    if(campaign.recipients.list_id !== this.listId) {
      errorMessages.push(`${campaign.settings.title} recipients.list_id !== ${this.listId}`)
    }

    if(campaign.settings.subject_line !== 'Posts from *|RSSFEED:TITLE|* for *|RSSFEED:DATE|*') {
      errorMessages.push(`${campaign.settings.title} settings.subject_line !== "Posts from *|RSSFEED:TITLE|* for *|RSSFEED:DATE|*"`)
    }

    if(campaign.settings.from_name !== 'Uniflow') {
      errorMessages.push(`${campaign.settings.title} settings.from_name !== "Uniflow"`)
    }

    if(campaign.settings.reply_to !== 'contact@uniflow.io' && this.env === 'production') {
      errorMessages.push(`${campaign.settings.title} settings.reply_to !== "contact@uniflow.io"`)
    }

    if(campaign.settings.folder_id !== campaignFolder.id) {
      errorMessages.push(`${campaign.settings.title} settings.folder_id !== "${campaignFolder.id}"`)
    }

    if(campaign.settings.template_id !== template.id) {
      errorMessages.push(`${campaign.settings.title} settings.template_id !== "${template.id}"`)
    }

    if(campaign.rss_opts.feed_url !== 'https://feeds.feedburner.com/uniflow-io/blog') {
      errorMessages.push(`${campaign.settings.title} settings.rss_opts.feed_url !== "https://feeds.feedburner.com/uniflow-io/blog"`)
    }

    if(errorMessages.length > 0) {
      throw new Error(errorMessages.join('\n'))
    }
  }

  public async sync(): Promise<any> {
    await this.syncMergeFields()
    await this.syncNewsletters()
    await this.syncBlog()
  }
}
