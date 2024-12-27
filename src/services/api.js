import axios from "axios";
import { formatApiError } from "../utils/errorHandling";
import { sahabaData } from '../data/sahaba';

const API_BASE_URL = "https://hadeethenc.com/api/v1";
const HADITH_API_BASE_URL = 'https://api.hadith.gading.dev';
/**
 * Fetches all hadith categories/books
 * @param {string} lang - Language code (en, ar, etc.)
 * @returns {Promise<Array>} List of hadith categories
 */
export const fetchHadithBooks = async (lang = "en") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/list/`, {
      params: { language: lang },
    });
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

/**
 * Fetches hadiths by category
 * @param {number} categoryId - Category/Book ID
 * @param {string} lang - Language code
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Paginated hadiths data
 */
export const fetchHadithsByBook = async (categoryId, lang = "ar", page = 1) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hadeeths/list/`, {
      params: {
        language: lang,
        category_id: categoryId,
        page,
        per_page: 20,
      },
    });

    // Manually calculate total pages if not provided
    const totalHadiths = response.data.pagination?.total || 711; // Use the known total if API doesn't provide
    const perPage = 20;
    const totalPages = Math.ceil(totalHadiths / perPage);

    return {
      ...response.data,
      pagination: {
        ...response.data.pagination,
        current_page: page,
        total_pages: totalPages,
        total: totalHadiths,
      }
    };
  } catch (error) {
    throw formatApiError(error);
  }
};

export const fetchSahabaList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sahaba/list/`);
    return response.data;
  } catch (error) {
    console.warn('Falling back to local data:', error.message);
    // Fallback to local data if API fails
    return sahabaData;
  }
};
export const fetchHadithBooksGading = async () => {
  try {
    const response = await axios.get(`${HADITH_API_BASE_URL}/books`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching hadith books from Gading API:', error);
    throw error;
  }
};

export const fetchHadithsByBookGading = async (bookName, startRange = 1, endRange = 50) => {
  try {
    const response = await axios.get(`${HADITH_API_BASE_URL}/books/${bookName}`, {
      params: {
        range: `${startRange}-${endRange}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching hadiths for book ${bookName} from Gading API:`, error);
    throw error;
  }
};
