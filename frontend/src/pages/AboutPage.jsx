import { useState } from "react";
import { 
  CodeIcon, 
  DatabaseIcon, 
  GlobeIcon, 
  UsersIcon, 
  MessageCircleIcon, 
  VideoIcon, 
  ImageIcon, 
  BellIcon,
  ShieldIcon,
  ZapIcon,
  HeartIcon,
  ShareIcon,
  SettingsIcon,
  PaletteIcon,
  FileTextIcon,
  GitBranchIcon,
  PackageIcon,
  ServerIcon,
  SmartphoneIcon
} from "lucide-react";

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: GlobeIcon },
    { id: "features", label: "Features", icon: ZapIcon },
    { id: "tech-stack", label: "Tech Stack", icon: CodeIcon },
    { id: "architecture", label: "Architecture", icon: ServerIcon },
    { id: "api-endpoints", label: "API Endpoints", icon: DatabaseIcon },
    { id: "database", label: "Database", icon: DatabaseIcon },
    { id: "authentication", label: "Authentication", icon: ShieldIcon },
    { id: "deployment", label: "Deployment", icon: PackageIcon },
    { id: "development", label: "Development", icon: GitBranchIcon }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">InstaChat</h1>
            <p className="text-lg opacity-80 mb-6">
              A modern, full-stack social media application with real-time messaging, 
              video calling, stories, and group chat functionality.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="badge badge-primary">React 18</span>
              <span className="badge badge-secondary">Node.js</span>
              <span className="badge badge-accent">MongoDB</span>
              <span className="badge badge-info">WebRTC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body text-center">
            <UsersIcon className="w-12 h-12 mx-auto text-primary mb-4" />
            <h3 className="card-title justify-center">Social Features</h3>
            <p className="text-sm opacity-70">
              Friend requests, mutual friends, user discovery, and profile management
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body text-center">
            <MessageCircleIcon className="w-12 h-12 mx-auto text-secondary mb-4" />
            <h3 className="card-title justify-center">Real-time Chat</h3>
            <p className="text-sm opacity-70">
              Instant messaging, group chats, and message history with Stream Chat
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body text-center">
            <VideoIcon className="w-12 h-12 mx-auto text-accent mb-4" />
            <h3 className="card-title justify-center">Video Calling</h3>
            <p className="text-sm opacity-70">
              One-on-one video calls with WebRTC integration and call notifications
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Core Features</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <UsersIcon className="w-6 h-6 text-primary" />
              <h3 className="card-title text-lg">User Management</h3>
            </div>
            <ul className="text-sm space-y-2 opacity-80">
              <li>• User registration and authentication</li>
              <li>• Profile picture upload with validation</li>
              <li>• Bio and location management</li>
              <li>• Friend request system</li>
              <li>• Mutual friends discovery</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <ImageIcon className="w-6 h-6 text-secondary" />
              <h3 className="card-title text-lg">Stories System</h3>
            </div>
            <ul className="text-sm space-y-2 opacity-80">
              <li>• Text and media stories (images/videos)</li>
              <li>• 24-hour story expiration</li>
              <li>• Story viewer with progress bars</li>
              <li>• File upload with size validation</li>
              <li>• Story creation modal</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircleIcon className="w-6 h-6 text-accent" />
              <h3 className="card-title text-lg">Group Chats</h3>
            </div>
            <ul className="text-sm space-y-2 opacity-80">
              <li>• Create and manage group chats</li>
              <li>• Add/remove group members</li>
              <li>• Group settings and permissions</li>
              <li>• Real-time group messaging</li>
              <li>• Group member management</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <VideoIcon className="w-6 h-6 text-info" />
              <h3 className="card-title text-lg">Video Calling</h3>
            </div>
            <ul className="text-sm space-y-2 opacity-80">
              <li>• One-on-one video calls</li>
              <li>• Call notification system</li>
              <li>• Accept/decline call functionality</li>
              <li>• WebRTC integration</li>
              <li>• Call timeout handling</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <BellIcon className="w-6 h-6 text-warning" />
              <h3 className="card-title text-lg">Notifications</h3>
            </div>
            <ul className="text-sm space-y-2 opacity-80">
              <li>• Friend request notifications</li>
              <li>• Story view notifications</li>
              <li>• Video call notifications</li>
              <li>• Real-time notification system</li>
              <li>• Notification management</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-3">
              <PaletteIcon className="w-6 h-6 text-success" />
              <h3 className="card-title text-lg">Theming</h3>
            </div>
            <ul className="text-sm space-y-2 opacity-80">
              <li>• Light/Dark theme support</li>
              <li>• Custom theme selection</li>
              <li>• 10+ predefined themes</li>
              <li>• Theme persistence</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTechStack = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <SmartphoneIcon className="w-6 h-6 text-primary" />
              <h3 className="card-title text-lg">Frontend</h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Core Framework</h4>
                <p className="text-sm opacity-70">React 18.3.1 with Vite for fast development</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">State Management</h4>
                <p className="text-sm opacity-70">TanStack Query for server state, Zustand for client state</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Styling</h4>
                <p className="text-sm opacity-70">TailwindCSS + DaisyUI for component library</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Routing</h4>
                <p className="text-sm opacity-70">React Router v6 for client-side routing</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Real-time Chat</h4>
                <p className="text-sm opacity-70">Stream Chat React SDK for messaging</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Video Calling</h4>
                <p className="text-sm opacity-70">Stream Video SDK for WebRTC calls</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <ServerIcon className="w-6 h-6 text-secondary" />
              <h3 className="card-title text-lg">Backend</h3>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Runtime</h4>
                <p className="text-sm opacity-70">Node.js with Express.js framework</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Database</h4>
                <p className="text-sm opacity-70">MongoDB with Mongoose ODM</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Authentication</h4>
                <p className="text-sm opacity-70">JWT tokens with Passport.js</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">File Upload</h4>
                <p className="text-sm opacity-70">Multer for handling multipart/form-data</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Security</h4>
                <p className="text-sm opacity-70">bcryptjs for password hashing, CORS enabled</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Development</h4>
                <p className="text-sm opacity-70">Nodemon for auto-restart, dotenv for environment variables</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <PackageIcon className="w-6 h-6 text-accent" />
            <h3 className="card-title text-lg">Key Dependencies</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Frontend Packages</h4>
              <ul className="space-y-1 opacity-70">
                <li>• @tanstack/react-query</li>
                <li>• react-router-dom</li>
                <li>• stream-chat-react</li>
                <li>• @stream-io/video-react-sdk</li>
                <li>• react-hot-toast</li>
                <li>• lucide-react</li>
                <li>• zustand</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Backend Packages</h4>
              <ul className="space-y-1 opacity-70">
                <li>• express</li>
                <li>• mongoose</li>
                <li>• jsonwebtoken</li>
                <li>• passport</li>
                <li>• bcryptjs</li>
                <li>• multer</li>
                <li>• cors</li>
                <li>• dotenv</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Development Tools</h4>
              <ul className="space-y-1 opacity-70">
                <li>• vite</li>
                <li>• nodemon</li>
                <li>• tailwindcss</li>
                <li>• daisyui</li>
                <li>• eslint</li>
                <li>• prettier</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchitecture = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">System Architecture</h2>
      
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Application Flow</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="badge badge-primary badge-lg">1</div>
              <div>
                <h4 className="font-semibold">User Authentication</h4>
                <p className="text-sm opacity-70">JWT-based authentication with protected routes and session management</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="badge badge-secondary badge-lg">2</div>
              <div>
                <h4 className="font-semibold">Data Fetching</h4>
                <p className="text-sm opacity-70">TanStack Query for server state management with caching and background updates</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="badge badge-accent badge-lg">3</div>
              <div>
                <h4 className="font-semibold">Real-time Features</h4>
                <p className="text-sm opacity-70">Stream Chat SDK for messaging and Stream Video SDK for video calls</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="badge badge-info badge-lg">4</div>
              <div>
                <h4 className="font-semibold">File Management</h4>
                <p className="text-sm opacity-70">Multer middleware for file uploads with validation and static file serving</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Frontend Architecture</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Component Structure</h4>
                <p className="opacity-70">Modular components with clear separation of concerns</p>
              </div>
              <div>
                <h4 className="font-semibold">State Management</h4>
                <p className="opacity-70">Zustand for global state, React hooks for local state</p>
              </div>
              <div>
                <h4 className="font-semibold">Routing</h4>
                <p className="opacity-70">Protected routes with authentication guards</p>
              </div>
              <div>
                <h4 className="font-semibold">API Integration</h4>
                <p className="opacity-70">Centralized API layer with axios interceptors</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Backend Architecture</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">MVC Pattern</h4>
                <p className="opacity-70">Models, Controllers, and Routes separation</p>
              </div>
              <div>
                <h4 className="font-semibold">Middleware</h4>
                <p className="opacity-70">Authentication, file upload, and error handling</p>
              </div>
              <div>
                <h4 className="font-semibold">Database Layer</h4>
                <p className="opacity-70">Mongoose schemas with validation and relationships</p>
              </div>
              <div>
                <h4 className="font-semibold">Security</h4>
                <p className="opacity-70">JWT tokens, password hashing, and CORS protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPIEndpoints = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
      
      <div className="space-y-4">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Authentication Routes</h3>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/auth/register</code></td>
                    <td>User registration</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/auth/login</code></td>
                    <td>User login</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/auth/me</code></td>
                    <td>Get current user</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-warning">POST</span></td>
                    <td><code>/api/auth/logout</code></td>
                    <td>User logout</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">User Routes</h3>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/users/</code></td>
                    <td>Get recommended users</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/users/friends</code></td>
                    <td>Get user's friends</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/users/friend-request/:id</code></td>
                    <td>Send friend request</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-warning">PUT</span></td>
                    <td><code>/api/users/friend-request/:id/accept</code></td>
                    <td>Accept friend request</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/users/profile-picture</code></td>
                    <td>Upload profile picture</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/users/:userId/mutual-friends</code></td>
                    <td>Get mutual friends</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Story Routes</h3>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/stories/</code></td>
                    <td>Create new story</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/stories/feed</code></td>
                    <td>Get stories feed</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/stories/my-stories</code></td>
                    <td>Get user's stories</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/stories/upload-media</code></td>
                    <td>Upload story media</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-warning">PUT</span></td>
                    <td><code>/api/stories/:id/view</code></td>
                    <td>Mark story as viewed</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">DELETE</span></td>
                    <td><code>/api/stories/:id</code></td>
                    <td>Delete story</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Group Routes</h3>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/groups/</code></td>
                    <td>Create new group</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/groups/</code></td>
                    <td>Get user's groups</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td><code>/api/groups/:id</code></td>
                    <td>Get group details</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-warning">PUT</span></td>
                    <td><code>/api/groups/:id</code></td>
                    <td>Update group</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td><code>/api/groups/:id/members</code></td>
                    <td>Add group members</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">DELETE</span></td>
                    <td><code>/api/groups/:id/members/:userId</code></td>
                    <td>Remove group member</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabase = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Database Schema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">User Model</h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-base-200 px-2 py-1 rounded">fullName: String</code> - User's full name</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">email: String</code> - Unique email address</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">password: String</code> - Hashed password</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">googleId: String</code> - Google OAuth ID</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">bio: String</code> - User biography</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">profilePic: String</code> - Profile picture URL</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">location: String</code> - User location</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">isOnboarded: Boolean</code> - Onboarding status</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">friends: [ObjectId]</code> - Array of friend IDs</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Story Model</h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-base-200 px-2 py-1 rounded">author: ObjectId</code> - Story author reference</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">content: String</code> - Story text content</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">media: Object</code> - Media file information</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">views: [ObjectId]</code> - Array of viewer IDs</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">isActive: Boolean</code> - Story active status</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">expiresAt: Date</code> - Story expiration time</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">FriendRequest Model</h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-base-200 px-2 py-1 rounded">sender: ObjectId</code> - Request sender</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">recipient: ObjectId</code> - Request recipient</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">status: String</code> - pending/accepted/rejected</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Group Model</h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-base-200 px-2 py-1 rounded">name: String</code> - Group name</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">description: String</code> - Group description</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">admin: ObjectId</code> - Group admin</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">members: [ObjectId]</code> - Group members</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">isPrivate: Boolean</code> - Group privacy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuthentication = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Authentication System</h2>
      
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">JWT Authentication Flow</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="badge badge-primary badge-lg">1</div>
              <div>
                <h4 className="font-semibold">User Registration/Login</h4>
                <p className="text-sm opacity-70">User provides credentials, server validates and returns JWT token</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="badge badge-secondary badge-lg">2</div>
              <div>
                <h4 className="font-semibold">Token Storage</h4>
                <p className="text-sm opacity-70">JWT token stored in httpOnly cookies for security</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="badge badge-accent badge-lg">3</div>
              <div>
                <h4 className="font-semibold">Request Authentication</h4>
                <p className="text-sm opacity-70">Each API request includes token in Authorization header</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="badge badge-info badge-lg">4</div>
              <div>
                <h4 className="font-semibold">Token Validation</h4>
                <p className="text-sm opacity-70">Server validates token and extracts user information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Security Features</h3>
            <ul className="space-y-2 text-sm">
              <li>• Password hashing with bcryptjs</li>
              <li>• JWT tokens with expiration</li>
              <li>• httpOnly cookies for token storage</li>
              <li>• CORS protection</li>
              <li>• Input validation and sanitization</li>
              <li>• Protected route middleware</li>
              <li>• Rate limiting on auth endpoints</li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Middleware Stack</h3>
            <ul className="space-y-2 text-sm">
              <li>• <code>protectRoute</code> - JWT token validation</li>
              <li>• <code>uploadSingle</code> - File upload handling</li>
              <li>• <code>errorHandler</code> - Global error handling</li>
              <li>• <code>cors</code> - Cross-origin resource sharing</li>
              <li>• <code>express.json()</code> - JSON body parsing</li>
              <li>• <code>cookieParser</code> - Cookie parsing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Deployment Guide</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Environment Variables</h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-base-200 px-2 py-1 rounded">PORT</code> - Server port (default: 5001)</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">MONGODB_URI</code> - MongoDB connection string</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">JWT_SECRET</code> - JWT signing secret</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">SESSION_SECRET</code> - Session secret</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">BASE_URL</code> - Base URL for file serving</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">STREAM_API_KEY</code> - Stream Chat API key</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">STREAM_SECRET</code> - Stream Chat secret</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Production Setup</h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Database</h4>
                <p className="opacity-70">MongoDB Atlas for cloud database</p>
              </div>
              <div>
                <h4 className="font-semibold">File Storage</h4>
                <p className="opacity-70">Local file system with static serving</p>
              </div>
              <div>
                <h4 className="font-semibold">Process Management</h4>
                <p className="opacity-70">PM2 for Node.js process management</p>
              </div>
              <div>
                <h4 className="font-semibold">Reverse Proxy</h4>
                <p className="opacity-70">Nginx for serving static files and load balancing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Deployment Commands</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Backend Deployment</h4>
              <pre className="bg-base-200 p-3 rounded text-sm overflow-x-auto">
{`# Install dependencies
npm install

# Set environment variables
cp .env.example .env

# Start production server
npm start

# Or with PM2
pm2 start src/server.js --name "instachat-api"`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Frontend Deployment</h4>
              <pre className="bg-base-200 p-3 rounded text-sm overflow-x-auto">
{`# Install dependencies
npm install

# Build for production
npm run build

# Serve static files
npm run preview

# Or deploy to Vercel/Netlify
vercel --prod`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevelopment = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Development Guide</h2>
      
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Getting Started</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Prerequisites</h4>
              <ul className="text-sm space-y-1 opacity-70">
                <li>• Node.js (v18 or higher)</li>
                <li>• MongoDB (local or Atlas)</li>
                <li>• Stream Chat account</li>
                <li>• Git</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Installation Steps</h4>
              <pre className="bg-base-200 p-3 rounded text-sm overflow-x-auto">
{`# Clone the repository
git clone <repository-url>
cd instachat

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Project Structure</h3>
            <div className="text-sm space-y-2">
              <div><code className="bg-base-200 px-2 py-1 rounded">/backend</code> - Node.js/Express API</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">/frontend</code> - React application</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">/uploads</code> - File uploads directory</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">/docs</code> - Documentation</div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Development Scripts</h3>
            <div className="text-sm space-y-2">
              <div><code className="bg-base-200 px-2 py-1 rounded">npm run dev</code> - Start development server</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">npm run build</code> - Build for production</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">npm start</code> - Start production server</div>
              <div><code className="bg-base-200 px-2 py-1 rounded">npm test</code> - Run tests</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Contributing Guidelines</h3>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold">Code Style</h4>
              <p className="opacity-70">Follow ESLint and Prettier configurations for consistent code formatting</p>
            </div>
            <div>
              <h4 className="font-semibold">Git Workflow</h4>
              <p className="opacity-70">Use feature branches and pull requests for new features</p>
            </div>
            <div>
              <h4 className="font-semibold">Testing</h4>
              <p className="opacity-70">Write tests for new features and ensure all tests pass</p>
            </div>
            <div>
              <h4 className="font-semibold">Documentation</h4>
              <p className="opacity-70">Update documentation for any API changes or new features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "features": return renderFeatures();
      case "tech-stack": return renderTechStack();
      case "architecture": return renderArchitecture();
      case "api-endpoints": return renderAPIEndpoints();
      case "database": return renderDatabase();
      case "authentication": return renderAuthentication();
      case "deployment": return renderDeployment();
      case "development": return renderDevelopment();
      default: return renderOverview();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">About InstaChat</h1>
          <p className="text-lg text-base-content opacity-70">
            Comprehensive documentation and implementation details for developers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg mb-4">Documentation</h3>
                  <div className="space-y-2">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                            activeSection === section.id
                              ? "bg-primary text-primary-content"
                              : "hover:bg-base-200"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{section.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

