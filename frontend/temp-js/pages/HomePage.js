import HomePostList from '@/components/domain/HomePostList';
import PopularPosts from '@/components/domain/PopularPosts';
const HomePage = () => {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-light-bg dark:bg-dark-bg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mx-auto px-4 py-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 max-w-[70%]"
  }, /*#__PURE__*/React.createElement(HomePostList, null)), /*#__PURE__*/React.createElement("div", {
    className: "w-[30%]"
  }, /*#__PURE__*/React.createElement(PopularPosts, null)))));
};
export default HomePage;