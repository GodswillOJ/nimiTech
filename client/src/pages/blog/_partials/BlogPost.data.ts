import blogPostImage from '../../../assets/blog/images/blogImage1.jpg';
import blogPostImage2 from '../../../assets/blog/images/blogImage2.jpg';
import blogPostImage3 from '../../../assets/blog/images/blogImage3.jpg';
import blogPostImage4 from '../../../assets/blog/images/blogImage3.jpg';
import blogPostImage5 from '../../../assets/blog/images/blogImage5.jpg';
import blogPostImage6 from '../../../assets/blog/images/blogImage6.jpg';
import featuredPostImage from '../../../assets/blog/images/blogImage6.jpg';
import { IBlogPost, IFeaturedPost } from '../blog.types';

export const featuredPost: IFeaturedPost = {
  id: 0,
  title: 'Breaking Into Product Design: Advice from Untitled Founder, Frankie',
  description:
    "Let's get one thing out of the way: you don't need a fancy Bachelor's Degree to get into Product Design. We sat down with Frankie Sullivan to talk about gatekeeping in product design and how anyone can get into this growing industry.",
  image: featuredPostImage,
  category: 'Featured',
  readTime: '15 min read',
  content: {
    subtitle: 'A Comprehensive Guide to Project Management Migration',
    paragraphs: [
      {
        type: 'text',
        content:
          'Linear has revolutionized how teams manage software projects. This guide will walk you through the essential steps to migrate your existing project management system to Linear effectively.',
      },
      {
        type: 'quote',
        content:
          'A well-organized project management system is key to maintaining development velocity and team alignment.',
      },
      {
        type: 'text',
        content:
          "Start by exporting your existing tasks and carefully mapping them to Linear's structure. Linear's intuitive interface and powerful features make it an excellent choice for modern development teams.",
      },
    ],
    highlights: {
      title: 'Key Benefits',
      benefits: [
        'Improves usability by making navigation smooth and intuitive',
        'Enhances accessibility to ensure inclusivity for all users',
        'Boosts engagement by creating visually appealing interfaces',
      ],
    },
  },
  author: {
    name: 'Frankie Sullivan',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    date: '8 June 2025',
  },
  youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
  contentImage: featuredPostImage,
  contentImageTitle: 'Breaking Into Product Design',
};

export const blogPosts: IBlogPost[] = [
  {
    id: 1,
    title: 'Migrating to Linear 101',
    description:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    category: 'Technology',
    readTime: '8 min read',
    author: {
      name: 'Jonathan Willis',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '8 June 2025',
    },
    image: blogPostImage2,
    content: {
      subtitle: 'A Comprehensive Guide to Project Management Migration',
      paragraphs: [
        {
          type: 'text',
          content:
            'Linear has revolutionized how teams manage software projects. This guide will walk you through the essential steps to migrate your existing project management system to Linear effectively.',
        },
        {
          type: 'quote',
          content:
            'A well-organized project management system is key to maintaining development velocity and team alignment.',
        },
        {
          type: 'text',
          content:
            "Start by exporting your existing tasks and carefully mapping them to Linear's structure. Linear's intuitive interface and powerful features make it an excellent choice for modern development teams.",
        },
      ],
      highlights: {
        title: 'Key Benefits',
        benefits: [
          'Improves usability by making navigation smooth and intuitive',
          'Enhances accessibility to ensure inclusivity for all users',
          'Boosts engagement by creating visually appealing interfaces',
        ],
      },
    },
    youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
    contentImage: featuredPostImage,
    contentImageTitle: 'Breaking Into Product Design',
  },
  {
    id: 2,
    title: 'Building your API Stack',
    description:
      'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.',
    category: 'Development',
    readTime: '12 min read',
    author: {
      name: 'Lana Steiner',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
      date: '8 June 2025',
    },
    image: blogPostImage,
    content: {
      subtitle: 'Modern Tools and Best Practices for API Development',
      paragraphs: [
        {
          type: 'text',
          content:
            "In today's interconnected world, APIs form the backbone of modern applications. Choosing the right tools and practices is crucial for building robust and maintainable APIs.",
        },
        {
          type: 'quote',
          content: 'The quality of your API documentation is as important as the API itself.',
        },
        {
          type: 'text',
          content:
            "From API design tools like Swagger to testing frameworks and monitoring solutions, we'll explore the essential components of a modern API development stack.",
        },
      ],
      highlights: {
        title: 'Key Benefits',
        benefits: [
          'Streamlines the development process with standardized protocols',
          'Facilitates integration between different services and platforms',
          'Enhances security by providing controlled access to resources',
        ],
      },
    },
    youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
    contentImage: blogPostImage,
    contentImageTitle: 'Breaking Into Product Design',
  },
  {
    id: 3,
    title: 'The Future of Web Development',
    description:
      'Exploring emerging trends and technologies shaping the future of web development.',
    category: 'Technology',
    readTime: '10 min read',
    author: {
      name: 'Jonathan Willis',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '8 June 2025',
    },
    image: blogPostImage3,
    content: {
      subtitle: 'Emerging Technologies and Trends in Web Development',
      paragraphs: [
        {
          type: 'text',
          content:
            'The web development landscape is constantly evolving. From new frameworks to innovative approaches, staying ahead of trends is crucial for modern developers.',
        },
        {
          type: 'quote',
          content:
            'The future of web development lies in performance, accessibility, and seamless user experiences.',
        },
        {
          type: 'text',
          content:
            "We'll explore upcoming technologies like Web Components, WebAssembly, and new JavaScript features that are shaping the future of web development.",
        },
      ],
      highlights: {
        title: 'Key Benefits',
        benefits: [
          'Adapts to the increasing demand for dynamic and interactive web applications',
          'Prepares you for the future job market with in-demand skills',
          'Enables the creation of high-performance, scalable web applications',
        ],
      },
    },
    youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
    contentImage: blogPostImage2,
    contentImageTitle: 'Breaking Into Product Design',
  },
  {
    id: 4,
    title: 'The Future of Web Development',
    description:
      'Exploring emerging trends and technologies shaping the future of web development.',
    category: 'Technology',
    readTime: '10 min read',
    author: {
      name: 'Jonathan Willis',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '8 June 2025',
    },
    image: blogPostImage4,
    content: {
      subtitle: 'Emerging Technologies and Trends in Web Development',
      paragraphs: [
        {
          type: 'text',
          content:
            'The web development landscape is constantly evolving. From new frameworks to innovative approaches, staying ahead of trends is crucial for modern developers.',
        },
        {
          type: 'quote',
          content:
            'The future of web development lies in performance, accessibility, and seamless user experiences.',
        },
        {
          type: 'text',
          content:
            "We'll explore upcoming technologies like Web Components, WebAssembly, and new JavaScript features that are shaping the future of web development.",
        },
      ],
      highlights: {
        title: 'Key Benefits',
        benefits: [
          'Adapts to the increasing demand for dynamic and interactive web applications',
          'Prepares you for the future job market with in-demand skills',
          'Enables the creation of high-performance, scalable web applications',
        ],
      },
    },
    youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
    contentImage: featuredPostImage,
    contentImageTitle: 'Breaking Into Product Design',
  },
  {
    id: 5,
    title: 'The Future of Web Development',
    description:
      'Exploring emerging trends and technologies shaping the future of web development.',
    category: 'Technology',
    readTime: '10 min read',
    author: {
      name: 'Jonathan Willis',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '8 June 2025',
    },
    image: blogPostImage5,
    content: {
      subtitle: 'Emerging Technologies and Trends in Web Development',
      paragraphs: [
        {
          type: 'text',
          content:
            'The web development landscape is constantly evolving. From new frameworks to innovative approaches, staying ahead of trends is crucial for modern developers.',
        },
        {
          type: 'quote',
          content:
            'The future of web development lies in performance, accessibility, and seamless user experiences.',
        },
        {
          type: 'text',
          content:
            "We'll explore upcoming technologies like Web Components, WebAssembly, and new JavaScript features that are shaping the future of web development.",
        },
      ],
      highlights: {
        title: 'Key Benefits',
        benefits: [
          'Adapts to the increasing demand for dynamic and interactive web applications',
          'Prepares you for the future job market with in-demand skills',
          'Enables the creation of high-performance, scalable web applications',
        ],
      },
    },
    youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
  },
  {
    id: 6,
    title: 'The Future of Web Development',
    description:
      'Exploring emerging trends and technologies shaping the future of web development.',
    category: 'Technology',
    readTime: '10 min read',
    author: {
      name: 'Jonathan Willis',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      date: '8 June 2025',
    },
    image: blogPostImage6,
    content: {
      subtitle: 'Emerging Technologies and Trends in Web Development',
      paragraphs: [
        {
          type: 'text',
          content:
            'The web development landscape is constantly evolving. From new frameworks to innovative approaches, staying ahead of trends is crucial for modern developers.',
        },
        {
          type: 'quote',
          content:
            'The future of web development lies in performance, accessibility, and seamless user experiences.',
        },
        {
          type: 'text',
          content:
            "We'll explore upcoming technologies like Web Components, WebAssembly, and new JavaScript features that are shaping the future of web development.",
        },
      ],
      highlights: {
        title: 'Key Benefits',
        benefits: [
          'Adapts to the increasing demand for dynamic and interactive web applications',
          'Prepares you for the future job market with in-demand skills',
          'Enables the creation of high-performance, scalable web applications',
        ],
      },
    },
    youtubeUrl: 'https://youtu.be/nbZK821T2_s?si=At8ejDG8Sg7jogGF',
    contentImage: featuredPostImage,
    contentImageTitle: 'Breaking Into Product Design',
  },
];
