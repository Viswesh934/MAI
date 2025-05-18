// import { useEffect, useState } from 'react';
// import { fetchCohereSummary } from '../services/docsummary';

// const SummaryFetcher = ({ text, onSuccess, onError, showOutput = true }) => {
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!text) return;

//     const summarize = async () => {
//       setLoading(true);

//       try {
//         const result = await fetchCohereSummary(text);
//         setSummary(result);
//         onSuccess?.(result);
//       } catch (err) {
//         onError?.(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     summarize();
//   }, [text]);

//   return showOutput ? (
//     <div>
//       {loading ? (
//         <p>Summarizing...</p>
//       ) : summary ? (
//         <div>
//           <h4>Summary:</h4>
//           <p>{summary}</p>
//         </div>
//       ) : null}
//     </div>
//   ) : null;
// };

// export default SummaryFetcher;
