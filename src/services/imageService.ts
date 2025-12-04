export class ImageService {
  private static readonly PLACEHOLDER = '/images/placeholder.svg';
  private static readonly API_BASE_URL = '/api/proxy';


  static getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return this.PLACEHOLDER;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${this.API_BASE_URL}${imagePath}`;
  }


  static isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export const imageService = ImageService;
