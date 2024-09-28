import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 bg-gray-900 rounded-md border border-purple-500 overflow-hidden">
      <div className="absolute top-0 left-0 bg-purple-600 text-white px-2 py-1 text-xs font-mono rounded-br">
        {language}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: '1.5rem 1rem 1rem',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          backgroundColor: 'transparent',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

function Blogs({ isFullScreenBlog, setIsFullScreenBlog, blogMetadata, blogContent, fetchBlogContent }) {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleBlogClick = async (blogId) => {
    setSelectedBlog(blogId);
    setIsFullScreenBlog(true);
    if (!blogContent[blogId]) {
      await fetchBlogContent(blogId);
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
            <h2 className="text-4xl font-bold mb-12 text-purple-400 text-center">Some words on internet 📜</h2>
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
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <CodeBlock
                              language={match[1]}
                              value={String(children).replace(/\n$/, '')}
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {blogContent[selectedBlog]}
                    </ReactMarkdown>
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
