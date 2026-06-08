const SUPABASE_URL = 'https://wbokbcyvmyxqpkknbzmj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tl0E7cpYmJRu6IYHw6pM4A_2lzHedCH';

const reviewsList = document.getElementById('reviewsList');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const errorState = document.getElementById('errorState');
const sortSelect = document.getElementById('sortSelect');
const totalCount = document.getElementById('totalCount');
const averageRating = document.getElementById('averageRating');
const latestPost = document.getElementById('latestPost');
const pageParams = new URLSearchParams(window.location.search);
const highlightedReviewId = pageParams.get('review');

let reviews = [];

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const setVisible = (element, isVisible) => {
  element.classList.toggle('is-hidden', !isVisible);
};

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const normalizeRating = (value) => {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return 0;
  return Math.min(5, Math.max(0, Math.round(rating)));
};

const createStars = (value) => {
  const rating = normalizeRating(value);
  return `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;
};

const compareByNewest = (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

const compareByRating = (a, b) => {
  const ratingDiff = normalizeRating(b.satisfaction) - normalizeRating(a.satisfaction);
  return ratingDiff || compareByNewest(a, b);
};

const updateStats = () => {
  totalCount.textContent = `${reviews.length}件`;

  if (reviews.length === 0) {
    averageRating.textContent = '—';
    latestPost.textContent = '—';
    return;
  }

  const ratingValues = reviews.map((review) => Number(review.satisfaction)).filter(Number.isFinite);
  const average = ratingValues.length > 0
    ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
    : 0;
  averageRating.textContent = ratingValues.length > 0 ? `${average.toFixed(1)} / 5` : '—';

  const latestReview = [...reviews].sort(compareByNewest)[0];
  latestPost.textContent = formatDate(latestReview?.created_at);
};

const createReviewCard = (review) => {
  const card = document.createElement('article');
  card.className = 'review-card';

  if (highlightedReviewId && String(review.id) === highlightedReviewId) {
    card.classList.add('is-highlighted');
    card.setAttribute('aria-label', '送信した感想');
  }

  const header = document.createElement('div');
  header.className = 'review-header';

  const meta = document.createElement('div');
  const name = document.createElement('p');
  name.className = 'review-name';
  name.textContent = review.nickname || '匿名のプレイヤー';

  const date = document.createElement('p');
  date.className = 'review-date';
  date.textContent = formatDate(review.created_at);

  meta.append(name, date);

  const rating = document.createElement('div');
  rating.className = 'review-rating';
  rating.setAttribute('aria-label', `満足度 ${normalizeRating(review.satisfaction)} / 5`);

  const stars = document.createElement('span');
  stars.className = 'review-stars';
  stars.textContent = createStars(review.satisfaction);

  const score = document.createElement('span');
  score.textContent = `${normalizeRating(review.satisfaction)} / 5`;

  rating.append(stars, score);
  header.append(meta, rating);

  const comment = document.createElement('p');
  comment.className = 'review-comment';
  comment.textContent = review.comment || '（本文なし）';

  card.append(header, comment);
  return card;
};

const renderReviews = () => {
  reviewsList.replaceChildren();

  const sortedReviews = [...reviews].sort(sortSelect.value === 'rating' ? compareByRating : compareByNewest);
  const fragment = document.createDocumentFragment();
  sortedReviews.forEach((review) => fragment.append(createReviewCard(review)));
  reviewsList.append(fragment);

  const highlightedCard = reviewsList.querySelector('.review-card.is-highlighted');
  if (highlightedCard) {
    highlightedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const loadReviews = async () => {
  setVisible(loadingState, true);
  setVisible(emptyState, false);
  setVisible(errorState, false);
  reviewsList.replaceChildren();

  if (!supabaseClient) {
    setVisible(loadingState, false);
    setVisible(errorState, true);
    return;
  }

  const { data, error } = await supabaseClient
    .from('reviews')
    .select('id, nickname, satisfaction, comment, created_at, is_public')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  setVisible(loadingState, false);

  if (error) {
    console.error('Failed to load reviews:', error);
    setVisible(errorState, true);
    return;
  }

  reviews = Array.isArray(data) ? data : [];
  updateStats();

  if (reviews.length === 0) {
    setVisible(emptyState, true);
    return;
  }

  renderReviews();
};

sortSelect.addEventListener('change', renderReviews);
loadReviews();
