import { Service } from 'typedi';

@Service()
class UI {
  copyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      document.execCommand('copy');
    } catch (err) {}
  
    document.body.removeChild(textArea);
  }
}

export default UI;
