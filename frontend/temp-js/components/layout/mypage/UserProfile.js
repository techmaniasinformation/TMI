import React from 'react';
import { Avatar, AvatarImage, AvatarFallback, Badge, Button } from '@/components';
const UserProfile = ({
  user,
  onEditProfile
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-lg shadow-sm border border-gray-200 p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-4"
  }, /*#__PURE__*/React.createElement(Avatar, {
    className: "w-20 h-20"
  }, /*#__PURE__*/React.createElement(AvatarImage, {
    src: user.avatar,
    alt: user.nickname
  }), /*#__PURE__*/React.createElement(AvatarFallback, null, user.nickname[0])), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center space-x-2 mb-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-semibold text-gray-900"
  }, user.nickname), user.badges.map((badge, index) => /*#__PURE__*/React.createElement(Badge, {
    key: index,
    variant: "secondary",
    className: "text-xs"
  }, badge))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-5 gap-4 text-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-gray-900"
  }, user.stats.posts), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "\uAC8C\uC2DC\uAE00")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-gray-900"
  }, user.stats.comments), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "\uB313\uAE00")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-gray-900"
  }, user.stats.followers), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "\uD314\uB85C\uC6CC")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-gray-900"
  }, user.stats.likes), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "\uC88B\uC544\uC694")), /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold text-gray-900"
  }, user.stats.views), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500"
  }, "\uC870\uD68C\uC218")))), /*#__PURE__*/React.createElement(Button, {
    onClick: onEditProfile,
    variant: "outline",
    size: "sm"
  }, "\uD504\uB85C\uD544 \uC218\uC815")));
};
export default UserProfile;