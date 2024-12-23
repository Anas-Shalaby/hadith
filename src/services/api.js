import axios from "axios";
import { formatApiError } from "../utils/errorHandling";

const API_BASE_URL = "https://hadeethenc.com/api/v1";

/**
 * Fetches all hadith categories/books
 * @param {string} lang - Language code (en, ar, etc.)
 * @returns {Promise<Array>} List of hadith categories
 */

export const fetchHadithBooks = async (lang = "en") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/roots/`, {
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
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};

/**
 * Fetches detailed information for a specific hadith
 * @param {number} hadithId - Hadith ID
 * @param {string} lang - Language code
 * @returns {Promise<Object>} Hadith details including explanation
 */
export const fetchHadithDetails = async (hadithId, lang = "ar") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hadeeths/one/`, {
      params: {
        language: lang,
        id: hadithId,
      },
    });
    return response.data;
  } catch (error) {
    throw formatApiError(error);
  }
};
