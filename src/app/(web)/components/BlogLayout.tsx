import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitHubFilledIcon,
  InstagramFilledIcon,
  YouTubeFilledIcon,
} from "./icon";
import Link from "next/link";

// Mock data for blog posts based on YouTube videos
const recentPosts = [
  {
    id: 1,
    title:
      "Tailwind css RESPONSIVE NAVBAR How to make a responsive navbar with tailwind css",
    image: "/blog/post1.jpg",
    date: "12/4/2022",
    category: "Tailwind CSS",
  },
  {
    id: 2,
    title:
      "Responsive Navbar With tailwind css How to make a responsive navbar with tailwind css",
    image: "/blog/post2.jpg",
    date: "12/11/2021",
    category: "Tailwind CSS",
  },
  {
    id: 3,
    title: "Responsive Sidebar with React js and tailwind css",
    image: "/blog/post3.jpg",
    date: "3/9/2022",
    category: "React",
  },
  {
    id: 4,
    title:
      "Responsive Navbar With React & tailwind css How to make a responsive navbar with react js and tailwind",
    image: "/blog/post4.jpg",
    date: "12/23/2021",
    category: "React",
  },
  {
    id: 5,
    title:
      "Responsive Sidebar With tailwind css How to make a responsive sidebar with tailwind css",
    image: "/blog/post5.jpg",
    date: "1/5/2022",
    category: "Tailwind CSS",
  },
  {
    id: 6,
    title: "Responsive Sidebar with React React js and tailwind",
    image: "/blog/post6.jpg",
    date: "8/12/2022",
    category: "React",
  },
  {
    id: 7,
    title: "Dynamic Stepper React js form stepper | React and tailwind",
    image: "/blog/post7.jpg",
    date: "9/6/2022",
    category: "React",
  },
  {
    id: 8,
    title: "React js dropdown menu close functionality | React js tips",
    image: "/blog/post8.jpg",
    date: "10/3/2022",
    category: "React",
  },
  {
    id: 9,
    title:
      "Responsive Navbar With vue & tailwind How to make a responsive navbar with vue js and tailwind",
    image: "/blog/post9.jpg",
    date: "1/7/2022",
    category: "Vue.js",
  },
  {
    id: 10,
    title:
      "Custom Selector React js & tailwind css Custom Dropdown Select Menu With Reactjs and tailwind",
    image: "/blog/post10.jpg",
    date: "9/9/2022",
    category: "React",
  },
  {
    id: 11,
    title: "Themes TAILWIND REACT Tailwind CSS Dark/Light/System Base themes",
    image: "/blog/post11.jpg",
    date: "11/1/2022",
    category: "React",
  },
  {
    id: 12,
    title:
      "Responsive Footer With React & tailwind How to make a responsive footer with react js and tailwind",
    image: "/blog/post12.jpg",
    date: "2/3/2022",
    category: "React",
  },
  {
    id: 13,
    title:
      "Navigation Menu With React & tailwind Magic Navigation Menu Indicator using React js and tailwind",
    image: "/blog/post13.jpg",
    date: "5/22/2022",
    category: "React",
  },
  {
    id: 14,
    title: "How to Add Syntax Highlighting to Code on Your Website",
    image: "/blog/post14.jpg",
    date: "1/21/2023",
    category: "Web Development",
  },
  {
    id: 15,
    title: "Tailwind CSS Only Awesome Testimonials Section Card Hover Effect",
    image: "/blog/post15.jpg",
    date: "10/10/2022",
    category: "Tailwind CSS",
  },
  {
    id: 16,
    title:
      "React Filterable Selectors ( Country, State, City) Using React js and tailwind",
    image: "/blog/post16.jpg",
    date: "1/18/2023",
    category: "React",
  },
  {
    id: 17,
    title: "Animated website design using tailwind css",
    image: "/blog/post17.jpg",
    date: "2/11/2022",
    category: "Tailwind CSS",
  },
  {
    id: 18,
    title:
      "Animated 3D Flip Card Animated 3D Flip Card Design Using Tailwind CSS",
    image: "/blog/post18.jpg",
    date: "3/7/2022",
    category: "Tailwind CSS",
  },
  {
    id: 19,
    title: "MOON Responsive website using React js and tailwind css",
    image: "/blog/post19.jpg",
    date: "1/13/2022",
    category: "React",
  },
  {
    id: 20,
    title:
      "Dynamic Pagination With React & tailwind React js and tailwind css with pagination",
    image: "/blog/post20.jpg",
    date: "1/18/2023",
    category: "React",
  },
];

const popularPosts = [
  {
    id: 1,
    title:
      "Tailwind css RESPONSIVE NAVBAR How to make a responsive navbar with tailwind css",
    image: "/blog/popular1.jpg",
    date: "12/4/2022",
    likes: "2,304 Likes",
  },
  {
    id: 2,
    title:
      "Responsive Navbar With tailwind css How to make a responsive navbar with tailwind css",
    image: "/blog/popular2.jpg",
    date: "12/11/2021",
    likes: "1,755 Likes",
  },
  {
    id: 3,
    title: "Responsive Sidebar with React js and tailwind css",
    image: "/blog/popular3.jpg",
    date: "3/9/2022",
    likes: "2,179 Likes",
  },
  {
    id: 4,
    title:
      "Responsive Navbar With React & tailwind css How to make a responsive navbar with react js and tailwind",
    image: "/blog/popular4.jpg",
    date: "12/23/2021",
    likes: "1,808 Likes",
  },
  {
    id: 5,
    title:
      "Responsive Sidebar With tailwind css How to make a responsive sidebar with tailwind css",
    image: "/blog/popular5.jpg",
    date: "1/5/2022",
    likes: "790 Likes",
  },
];

const categories = [
  { name: "React", count: 12 },
  { name: "Tailwind CSS", count: 8 },
  { name: "Vue.js", count: 1 },
  { name: "Web Development", count: 1 },
  { name: "Navigation Bar", count: 6 },
  { name: "Sidebar Menu", count: 4 },
  { name: "Responsive Design", count: 15 },
  { name: "UI Components", count: 8 },
  { name: "Form Components", count: 3 },
  { name: "Animation", count: 3 },
  { name: "Themes", count: 1 },
  { name: "Pagination", count: 1 },
  { name: "Footer", count: 1 },
  { name: "Testimonials", count: 1 },
  { name: "Code Highlighting", count: 1 },
];

export default function BlogLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Recent Posts</h1>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      Image Placeholder
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs p-0 h-auto"
                  >
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button variant="outline" size="sm" disabled>
              ←
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="outline" size="sm">
              41
            </Button>
            <Button variant="outline" size="sm">
              →
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Follow Us Section */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Follow Us</h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2.5">
              <Link
                href="https://www.youtube.com/@codeaprogram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-between p-3 bg-red-600 text-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <YouTubeFilledIcon className="w-8 h-8" />
                    <span className="text-sm">YouTube</span>
                  </div>
                  <span className="text-sm">10k+ Subscribers</span>
                </div>
              </Link>
              <Link
                href="https://www.instagram.com/codeaprogram/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <InstagramFilledIcon className="w-8 h-8" />
                    <span className="text-sm">Instagram</span>
                  </div>
                  <span className="text-sm">130+ Followers</span>
                </div>
              </Link>
              {/* github */}
              <Link
                href="https://github.com/sridhar-c-25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <GitHubFilledIcon className="w-8 h-8" />
                    <span className="text-sm">GitHub</span>
                  </div>
                  <span className="text-sm">400+ Followers</span>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Advertisement */}

          {/* Most Popular */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Most Popular</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularPosts.map((post, index) => (
                <div key={post.id} className="flex gap-3">
                  <div className="w-16 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                    <p className="text-xs text-green-600 font-medium">
                      {post.likes}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  ←
                </Button>
                <Button variant="outline" size="sm">
                  →
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Featured Post */}
          <Card className="bg-yellow-500 text-white">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-yellow-500 font-bold text-xs">JS</span>
                </div>
                <h4 className="font-semibold text-sm mb-2">
                  JAVASCRIPT PROJECTS
                </h4>
                <p className="text-xs opacity-90 mb-3">
                  Best 30+ JavaScript Projects for Practice (With Source Code)
                </p>
                <p className="text-xs">Coming Soon</p>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Categories</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-sm hover:text-primary cursor-pointer transition-colors">
                      {category.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
