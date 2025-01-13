const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

exports.getLatestNews = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;

    const currentDate = new Date();
    const lastWeekDate = new Date();
    lastWeekDate.setDate(currentDate.getDate() - 7);

    const from = lastWeekDate.toISOString();
    const to = currentDate.toISOString();

    const response = await newsapi.v2.everything({
      q: 'cars',
      language: 'en',
      pageSize,
      page,
      searchIn: 'title',
      sortBy: 'publishedAt',
      from,
      to,
    });

    if (response.status !== 'ok') {
      return res.status(500).json({ message: 'Error al obtener las noticias' });
    }

    const seenTitles = new Set();
    const uniqueArticles = response.articles.filter(article => {
      const isDuplicate = seenTitles.has(article.title);
      seenTitles.add(article.title);
      return !isDuplicate;
    });

    const totalResults = response.totalResults;

    res.status(200).json({
      articles: uniqueArticles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        image: article.urlToImage,
        source: article.source.name,
        publishedAt: article.publishedAt,
      })),
      totalResults: totalResults,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / pageSize),
    });
  } catch (error) {
    console.error('Error al consultar las noticias:', error);
    res.status(500).json({ message: 'No se pudieron obtener las noticias', error: error.message });
  }
};
