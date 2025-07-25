// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import debounce from 'lodash/debounce';

interface MyPageProps {}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  iconColor: string;
  condition: () => boolean;
  progress?: {
    current: number;
    required: number;
  };
}

interface UserStats {
  posts: number;
  comments: number;
  followers: number;
  likes: number;
  views: number;
  bugReports: number;
  tagCounts: {
    SPRING: number;
    REACT: number;
    AI: number;
    DB: number;
    AWS: number;
  };
  hasFirstPost: boolean;
  hasFirstComment: boolean;
  isRegistered: boolean;
}

const MyPage: React.FC<MyPageProps> = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFollowing, setIsFollowing] = useState(false);
  const postsPerPage = 5;
  const [isCompany, setIsCompany] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<string | null>('first-post');
  const [nickname, setNickname] = useState('NAVER');
  const [lastUpdate, setLastUpdate] = useState('2025-07-22');

  const [userStats] = useState<UserStats>({
    posts: 15,
    comments: 42,
    followers: 128,
    likes: 256,
    views: 3200,
    bugReports: 5,
    tagCounts: {
      SPRING: 12,
      REACT: 8,
      AI: 4,
      DB: 15,
      AWS: 11
    },
    hasFirstPost: true,
    hasFirstComment: true,
    isRegistered: true
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: 'what-is-this',
      title: '이건 머지?',
      description: '첫 번째 게시물을 작성했습니다!',
      icon: 'fa-question-circle',
      backgroundColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      condition: () => userStats.hasFirstPost
    },
    {
      id: 'what-is-that',
      title: '얘는 머지?',
      description: '첫 번째 댓글을 작성했습니다!',
      icon: 'fa-comment-dots',
      backgroundColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      condition: () => userStats.hasFirstComment
    },
    {
      id: 'hello-world',
      title: 'Hello World',
      description: 'TMI에 가입했습니다!',
      icon: 'fa-hand-wave',
      backgroundColor: 'bg-purple-50',
      textColor: 'text-purple-800',
      iconColor: 'text-purple-600',
      condition: () => userStats.isRegistered
    }
  ]);

  const [blogUrl, setBlogUrl] = useState('https://blog.example.com');
  const [githubUrl, setGithubUrl] = useState('https://github.com/example');
  const [nicknameStatus, setNicknameStatus] = useState('');
  const [lastNicknameChange, setLastNicknameChange] = useState<Date | null>(null);
  const checkNicknameAvailability = debounce(async (value: string) => {
    if (value === nickname) return;
    // Simulated API call
    const isAvailable = value.length > 2;
    setNicknameStatus(isAvailable ? '사용 가능한 닉네임입니다' : '이미 등록된 사용자/기업 닉네임입니다');
  }, 100);
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    checkNicknameAvailability(value);
  };
  const canChangeNickname = () => {
    if (!lastNicknameChange) return true;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return lastNicknameChange < oneMonthAgo;
  };
  const handleSave = () => {
    setLastNicknameChange(new Date());
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Edit Profile Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <span></span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>프로필 수정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <img
                    src="https://readdy.ai/api/search-image?query=naver%20logo%20in%20green%20color%20on%20pure%20white%20background%2C%20minimalist%20corporate%20design%2C%20professional%20branding%2C%20high%20quality%20vector%20style&width=128&height=128&seq=profile003&orientation=squarish"
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </Avatar>
                <Button
                  className="!rounded-button whitespace-nowrap absolute bottom-0 right-0 w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700"
                  onClick={() => document.getElementById('profileImageInput').click()}
                  title="Upload profile image"
                >
                  <i className="fas fa-camera text-white"></i>
                </Button>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // File validation
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSize) {
                      const dialog = document.createElement('div');
                      dialog.innerHTML = `
                        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <div class="flex items-center text-red-600 mb-4">
                              <i class="fas fa-exclamation-circle mr-2"></i>
                              <h3 class="text-lg font-medium">File too large</h3>
                            </div>
                            <p class="text-gray-600 mb-4">Please select an image under 5MB.</p>
                            <div class="flex justify-end">
                              <button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 !rounded-button whitespace-nowrap"
                                onclick="this.parentElement.parentElement.parentElement.remove()">
                                OK
                              </button>
                            </div>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(dialog);
                      e.target.value = '';
                      return;
                    }
                    // Show preview and upload progress
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const previewDialog = document.createElement('div');
                      previewDialog.innerHTML = `
                        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                            <div class="mb-4">
                              <h3 class="text-lg font-medium text-gray-900">Upload Profile Image</h3>
                              <p class="text-sm text-gray-500 mt-1">Preview your selection before uploading</p>
                            </div>
                            <div class="relative w-full h-64 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                              <img src="${event.target?.result}" alt="Preview" class="w-full h-full object-cover"/>
                            </div>
                            <div class="mb-4 hidden" id="uploadProgress">
                              <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                              </div>
                              <p class="text-sm text-gray-500 mt-1 text-center">Uploading: 0%</p>
                            </div>
                            <div class="flex justify-end space-x-2">
                              <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 !rounded-button whitespace-nowrap"
                                onclick="this.parentElement.parentElement.parentElement.remove(); document.getElementById('profileImageInput').value = '';">
                                Cancel
                              </button>
                              <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 !rounded-button whitespace-nowrap"
                                onclick="document.getElementById('uploadProgress').classList.remove('hidden'); this.disabled = true; this.innerHTML = 'Uploading...'">
                                Upload
                              </button>
                            </div>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(previewDialog);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
                <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                  Supported formats: JPG, PNG, GIF (max 5MB)
                </div>
              </div>
              <p className="text-sm text-gray-500">Click the camera icon to change profile image</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={handleNicknameChange}
                disabled={!canChangeNickname()}
              />
              {nicknameStatus && (
                <p className={`text-sm ${nicknameStatus.includes('사용 가능') ? 'text-green-600' : 'text-red-600'}`}>
                  {nicknameStatus}
                </p>
              )}
              {!canChangeNickname() && (
                <p className="text-sm text-orange-600">닉네임은 한 달에 한 번만 변경할 수 있습니다.</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="blog">블로그 URL</Label>
              <Input
                id="blog"
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="github">Github URL</Label>
              <Input
                id="github"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <Button className="!rounded-button whitespace-nowrap mt-4" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Main Content */}
      <div>
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap bg-white hover:bg-gray-100"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit mr-2"></i>
                  프로필 수정
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="!rounded-button whitespace-nowrap bg-white hover:bg-gray-100 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <i className="fas fa-user-times mr-2"></i>
                      회원탈퇴
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>회원탈퇴</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-gray-700">탈퇴 후 7일 이내 재가입이 불가합니다. 정말 탈퇴하시겠습니까?</p>
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button
                          variant="outline"
                          className="!rounded-button whitespace-nowrap"
                          onClick={() => {
                            const dialogElement = document.querySelector('[role="dialog"]');
                            if (dialogElement) {
                              const closeButton = dialogElement.querySelector('button[type="button"]');
                              if (closeButton) {
                                closeButton.click();
                              }
                            }
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          className="!rounded-button whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            const dialogElement = document.querySelector('[role="dialog"]');
                            if (dialogElement) {
                              const closeButton = dialogElement.querySelector('button[type="button"]');
                              if (closeButton) {
                                closeButton.click();
                              }
                            }
                            // Show completion modal
                            const dialog = document.createElement('div');
                            dialog.innerHTML = `
                              <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                                  <h3 class="text-lg font-medium text-gray-900 mb-4">탈퇴가 정상 처리되었습니다.</h3>
                                  <div class="flex justify-end">
                                    <button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 !rounded-button whitespace-nowrap"
                                      onclick="this.parentElement.parentElement.parentElement.remove(); window.location.href='/';">
                                      확인
                                    </button>
                                  </div>
                                </div>
                              </div>
                            `;
                            document.body.appendChild(dialog);
                          }}
                        >
                          탈퇴
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Avatar className="w-32 h-32">
                <img
                  src="https://readdy.ai/api/search-image?query=naver%20logo%20in%20green%20color%20on%20pure%20white%20background%2C%20minimalist%20corporate%20design%2C%20professional%20branding%2C%20high%20quality%20vector%20style&width=128&height=128&seq=profile003&orientation=squarish"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">NAVER</h1>
                  <Badge className="bg-blue-100 text-blue-800">기업</Badge>
                  {selectedBadge ? (
                    <Badge
                      className={`${achievements.find(a => a.id === selectedBadge)?.backgroundColor} ${achievements.find(a => a.id === selectedBadge)?.textColor} text-xs px-2 py-1`}
                    >
                      <i className={`fas ${achievements.find(a => a.id === selectedBadge)?.icon} mr-1`}></i>
                      {achievements.find(a => a.id === selectedBadge)?.title}
                    </Badge>
                  ) : (
                    <Badge
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1"
                    >
                      배지 없음
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    최근 업데이트: {lastUpdate}
                  </span>
                </div>
                <div className="flex items-center space-x-6">
                  <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
                    <i className="fas fa-link mr-2"></i>
                    <span className="text-sm">내 블로그</span>
                  </a>
                  <Button
                    className={`!rounded-button whitespace-nowrap ${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'} text-white`}
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      const dialog = document.createElement('div');
                      dialog.innerHTML = `
                        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                            <div class="flex items-center ${isFollowing ? 'text-red-600' : 'text-green-600'} mb-4">
                              <i class="fas ${isFollowing ? 'fa-user-minus' : 'fa-check-circle'} mr-2"></i>
                              <h3 class="text-lg font-medium">${isFollowing ? '팔로우 취소' : '팔로우 완료'}</h3>
                            </div>
                            <p class="text-gray-600 mb-4">NAVER님을 ${isFollowing ? '팔로우 취소했습니다.' : '팔로우하기 시작했습니다.'}</p>
                            <div class="flex justify-end">
                              <button class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 !rounded-button whitespace-nowrap"
                                onclick="this.parentElement.parentElement.parentElement.remove()">
                                확인
                              </button>
                            </div>
                          </div>
                        </div>
                      `;
                      document.body.appendChild(dialog);
                    }}
                  >
                    <i className={`fas ${isFollowing ? 'fa-user-minus' : 'fa-user-plus'} mr-2`}></i>
                    {isFollowing ? '팔로우 취소' : '팔로우'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">256</div>
                <div className="text-sm text-gray-600">게시글 수</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">15.4k</div>
                <div className="text-sm text-gray-600">팔로워 수</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">2.8M</div>
                <div className="text-sm text-gray-600">누적 조회 수</div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Menu */}
        <Tabs value={activeTab} onValueChange={(value) => {
          if (isCompany && value !== "posts") {
            setActiveTab("posts");
          } else {
            setActiveTab(value);
          }
        }} className="w-full">
          <TabsList className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 w-full flex justify-start p-0 h-auto">
            {/* 임시로 모든 탭을 보이게 설정 */}
            <TabsTrigger
              value="profile"
              className="flex items-center px-6 py-4 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
              <i className="fas fa-user mr-2"></i>
              <span className="text-sm">내 정보</span>
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="flex items-center px-6 py-4 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
              <i className="fas fa-comments mr-2"></i>
              <span className="text-sm">작성한 댓글</span>
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="flex items-center px-6 py-4 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
              <i className="fas fa-file-alt mr-2"></i>
              <span className="text-sm">작성한 게시글</span>
            </TabsTrigger>
            <TabsTrigger
              value="follow"
              className="flex items-center px-6 py-4 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
              <i className="fas fa-users mr-2"></i>
              <span className="text-sm">팔로우</span>
            </TabsTrigger>
            <TabsTrigger
              value="starred"
              className="flex items-center px-6 py-4 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600">
              <i className="fas fa-star mr-2"></i>
              <span className="text-sm">스타 게시글</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="comments" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">작성한 댓글</h2>
              <div className="space-y-4">
                {[
                  {
                    postTitle: "React 18의 새로운 기능 소개",
                    comment: "Concurrent Mode는 정말 혁신적인 기능인 것 같습니다. 특히 사용자 경험 측면에서 큰 향상이 있을 것 같네요.",
                    postId: "post1",
                    commentId: "comment1"
                  }
                ].map((item, index) => (
                  <div
                    key={item.commentId}
                    className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => window.location.href = `#${item.postId}`}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{item.postTitle}</h3>
                    <p className="text-gray-600 text-sm">{item.comment}</p>
                    <div className="mt-2 text-xs text-gray-400">2025년 7월 18일</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="profile" className="mt-0">
            <div>
              {/* Achievements Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="fas fa-trophy text-purple-600 mr-2"></i>
                  업적
                </h2>
                <div className="grid grid-cols-8 gap-4">
                  {[...achievements].sort((a, b) => {
                    if (a.condition() && !b.condition()) return -1;
                    if (!a.condition() && b.condition()) return 1;
                    return 0;
                  }).map((achievement) => (
                    <Dialog key={achievement.id}>
                      <DialogTrigger asChild>
                        <div
                          className={`aspect-square flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl transition-all duration-300 ${!achievement.condition() && 'grayscale opacity-50'} cursor-pointer group relative overflow-hidden`}
                        >
                          <div className={`w-20 h-20 ${achievement.backgroundColor} rounded-2xl flex items-center justify-center mb-3 transform group-hover:scale-105 transition-transform duration-300 relative`}
                            style={{
                              boxShadow: achievement.condition() ? '0 8px 24px -4px rgba(145, 85, 253, 0.3)' : 'none'
                            }}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                            <i className={`fas ${achievement.icon} ${achievement.iconColor} text-2xl`}></i>
                          </div>
                          <div className="text-center z-10">
                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{achievement.title}</h3>
                            {!achievement.condition() && achievement.progress && (
                              <div className="w-full mt-2">
                                <p className="text-[11px] text-gray-600 mb-1.5 font-medium">
                                  {achievement.progress.current.toLocaleString()} / {achievement.progress.required.toLocaleString()}
                                  {achievement.id === 'popular-writer' ? '회' : '개'}
                                </p>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                      width: `${(achievement.progress.current / achievement.progress.required) * 100}%`,
                                      boxShadow: '0 2px 6px -1px rgba(145, 85, 253, 0.3)'
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 group-hover:opacity-0 transition-opacity duration-300"></div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]" hideClose>
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">{achievement.title}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <div className={`w-20 h-20 ${achievement.backgroundColor} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                            <i className={`fas ${achievement.icon} ${achievement.iconColor} text-2xl`}></i>
                          </div>
                          <p className="text-gray-600 text-center mb-4">{achievement.description}</p>
                          {achievement.condition() ? (
                            <div className="space-y-4">
                              <div className="text-center">
                                <Badge className="bg-green-100 text-green-800">
                                  <i className="fas fa-check-circle mr-2"></i>
                                  2025년 7월 22일 획득
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 mt-4">
                                <Button
                                  onClick={() => {
                                    setSelectedBadge(selectedBadge === achievement.id ? null : achievement.id);
                                    const dialogElement = document.querySelector('[role="dialog"]');
                                    if (dialogElement) {
                                      const closeButton = dialogElement.querySelector('button[type="button"]');
                                      if (closeButton) {
                                        closeButton.click();
                                      }
                                    }
                                  }}
                                  variant={selectedBadge === achievement.id ? "outline" : "default"}
                                  className="!rounded-button whitespace-nowrap flex-1"
                                >
                                  {selectedBadge === achievement.id ? "대표 배지 해제" : "대표 배지로 설정"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="!rounded-button whitespace-nowrap flex-1"
                                  onClick={() => {
                                    const dialogElement = document.querySelector('[role="dialog"]');
                                    if (dialogElement) {
                                      const closeButton = dialogElement.querySelector('button[type="button"]');
                                      if (closeButton) {
                                        closeButton.click();
                                      }
                                    }
                                  }}
                                >
                                  닫기
                                </Button>
                              </div>
                            </div>
                          ) : achievement.progress && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600 text-center">
                                  진행률: {achievement.progress.current.toLocaleString()} / {achievement.progress.required.toLocaleString()}
                                  {achievement.id === 'popular-writer' ? '회' : '개'}
                                </p>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{
                                      width: `${(achievement.progress.current / achievement.progress.required) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-center">
                                <Button
                                  variant="outline"
                                  className="!rounded-button whitespace-nowrap w-full"
                                  onClick={() => {
                                    const dialogElement = document.querySelector('[role="dialog"]');
                                    if (dialogElement) {
                                      const closeButton = dialogElement.querySelector('button[type="button"]');
                                      if (closeButton) {
                                        closeButton.click();
                                      }
                                    }
                                  }}
                                >
                                  닫기
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="posts" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">작성한 게시글</h2>
              <div className="space-y-4">
                {[
                  {
                    id: 'post1',
                    title: "React와 TypeScript로 시작하는 웹 개발",
                    thumbnail: "https://readdy.ai/api/search-image?query=modern%20laptop%20with%20code%20editor%20showing%20React%20and%20TypeScript%20code%20on%20screen%2C%20clean%20desk%20setup%20with%20minimal%20decoration%2C%20professional%20development%20environment&width=200&height=120&seq=post1&orientation=landscape",
                    tags: ["React", "TypeScript", "Web Development"],
                    views: 1234,
                    stars: 56,
                    comments: 23
                  }
                ].map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => window.location.href = `#${post.id}`}
                  >
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-[200px] h-[120px] object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="fas fa-eye mr-1"></i>
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-star mr-1"></i>
                          {post.stars}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-comment mr-1"></i>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={true}
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  이전
                </Button>
                <Button
                  key={1}
                  variant={"default"}
                  className="!rounded-button whitespace-nowrap"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap"
                  onClick={() => setCurrentPage(prev => Math.min(1, prev + 1))}
                  disabled={true}
                >
                  다음
                  <i className="fas fa-chevron-right ml-2"></i>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="starred" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">스타 게시글</h2>
              <div className="space-y-4">
                {[
                  {
                    id: 'starred1',
                    title: "2025년 프론트엔드 개발 트렌드",
                    thumbnail: "https://readdy.ai/api/search-image?query=modern%20computer%20setup%20showing%20latest%20web%20development%20trends%2C%20professional%20workspace%20with%20clean%20minimal%20design&width=200&height=120&seq=starred1&orientation=landscape",
                    tags: ["프론트엔드", "트렌드", "개발"],
                    views: 2345,
                    stars: 89,
                    comments: 34
                  }
                ].map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => window.location.href = `#${post.id}`}
                  >
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-[200px] h-[120px] object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="fas fa-eye mr-1"></i>
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-star mr-1"></i>
                          {post.stars}
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-comment mr-1"></i>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={true}
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  이전
                </Button>
                <Button
                  key={1}
                  variant={"default"}
                  className="!rounded-button whitespace-nowrap"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  className="!rounded-button whitespace-nowrap"
                  onClick={() => setCurrentPage(prev => Math.min(1, prev + 1))}
                  disabled={true}
                >
                  다음
                  <i className="fas fa-chevron-right ml-2"></i>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="follow" className="mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <Tabs defaultValue="company" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="company" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    기업
                  </TabsTrigger>
                  <TabsTrigger value="personal" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    개인
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="company">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'company1',
                        name: 'Tech Solutions Inc.',
                        image: 'https://readdy.ai/api/search-image?query=modern%20tech%20company%20logo%20design%20with%20abstract%20geometric%20shapes%2C%20professional%20corporate%20branding%2C%20clean%20minimal%20style&width=80&height=80&seq=comp1&orientation=squarish'
                      }
                    ].map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => window.location.href = `#${company.id}`}
                      >
                        <img
                          src={company.image}
                          alt={company.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-900">{company.name}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        id: 'user1',
                        nickname: '개발왕김코딩',
                        badge: '시니어 개발자',
                        image: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20male%20developer%20with%20modern%20background%2C%20confident%20expression%2C%20tech%20professional&width=80&height=80&seq=user1&orientation=squarish'
                      }
                    ].map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                        onClick={() => window.location.href = `#${user.id}`}
                      >
                        <img
                          src={user.image}
                          alt={user.nickname}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{user.nickname}</div>
                          <Badge className="mt-1 bg-purple-100 text-purple-800 text-xs">
                            {user.badge}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyPage;