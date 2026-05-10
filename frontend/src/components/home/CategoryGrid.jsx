import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Men',
    image: '/categories/men.jpg',
    link: '/shop/men'
  },
  {
    name: 'Women',
    image: '/categories/women.jpg',
    link: '/shop/women'
  },
  {
    name: 'Accessories',
    image: '/categories/accessories.jpg',
    link: '/shop/accessories'
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="section-title">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={category.link}
                className="group block relative overflow-hidden aspect-[4/5]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl md:text-3xl font-display font-semibold">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
