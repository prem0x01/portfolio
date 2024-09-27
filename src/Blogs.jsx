import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

function Blogs({ isFullScreenBlog, setIsFullScreenBlog, blogMetadata, blogContent, fetchBlogContent }) {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleBlogClick = (blogId) => {
    setSelectedBlog(blogId);
    setIsFullScreenBlog(true);
    if (!blogContent[blogId]) {
      fetchBlogContent(blogId);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenBlog(false);
    setSelectedBlog(null);
  };

  useEffect(() => {
    if (isFullScreenBlog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullScreenBlog]);

  return (
    <motion.div 
      className={`blogs-container ${isFullScreenBlog ? 'pt-0' : 'pt-20'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {!isFullScreenBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-purple-400 text-center">My Blog</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogMetadata.map((blog) => (
                <motion.div 
                  key={blog.id} 
                  className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-purple-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBlogClick(blog.id)}
                >
                  <h3 className="text-2xl font-semibold mb-3 text-purple-400">{blog.title}</h3>
                  <p className="text-purple-300 mb-3 text-sm">
                    <span className="mr-3">{formatDate(blog.date)}</span>
                    <span>{blog.readTime}</span>
                  </p>
                  <p className="text-purple-300 mb-4 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex flex-wrap mb-4">
                    {blog.tags.map((tag, index) => (
                      <span key={index} className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs mr-2 mb-2">{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors duration-300"
                  >
                    Read More
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {isFullScreenBlog && selectedBlog && (
          <motion.div 
            className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container mx-auto px-4 py-8 max-w-3xl min-h-screen flex flex-col">
              {blogContent[selectedBlog] ? (
                <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 sm:p-8 border border-purple-500 flex-grow">
                  <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-purple-400 break-words">{blogMetadata.find(blog => blog.id === selectedBlog)?.title}</h1>
                  <p className="text-purple-300 mb-6 text-sm sm:text-base">
                    <span className="mr-4">{formatDate(blogMetadata.find(blog => blog.id === selectedBlog)?.date)}</span>
                    <span>{blogMetadata.find(blog => blog.id === selectedBlog)?.readTime}</span>
                  </p>
                  <div className="prose prose-sm sm:prose-lg prose-invert max-w-none">
                    <ReactMarkdown>{blogContent[selectedBlog]}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleCloseFullScreen}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors duration-300"
                >
                  ← Back to Blog List
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Blogs;
