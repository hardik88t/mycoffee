# Development Guide

## 📋 Overview

This guide covers:
- **Project Manager Integration** - How to connect and interact with the central project management system
- **General Coding Practices** - Universal best practices for all projects
- **Documentation Maintenance** - How to keep DEV.md, PLAN.md, and DEVLOG.md updated

**⚠️ Important**: Update this DEV.md file regularly as your project evolves. Add project-specific practices, tools, and workflows that are unique to your tech stack.

## 🔗 Project Manager Integration

### Database Schema (Key Tables)

**Projects Table:**
```sql
- id (UUID, primary key)
- name (string, required)
- type (WEBAPP/WEBSITE/CLI/API/MOBILE/DESKTOP/etc.)
- status (PLANNING/ACTIVE/COMPLETED/ON_HOLD/ARCHIVED)
- priority (LOW/MEDIUM/HIGH/URGENT)
- briefDescription (text)
- detailedDescription (text, optional)
- liveUrl, githubUrl, localPath (strings, optional)
- techStack, tags (JSON arrays as strings)
- createdAt, updatedAt (timestamps)
```

**ProjectItem Table:**
```sql
- id (UUID, primary key)
- projectId (UUID, foreign key)
- name (string, required)
- description (text, optional)
- type (FEATURE/BUG/IMPROVEMENT/TASK/RESEARCH/DOCUMENTATION)
- status (TODO/IN_PROGRESS/COMPLETED/BLOCKED/CANCELLED)
- priority (LOW/MEDIUM/HIGH/URGENT)
- labels (JSON array as string)
- createdAt, updatedAt (timestamps)
```

### Connection Setup

**Local Development:**
```bash
# Set environment variable
export PROJECT_MANAGER_DB="file:../project-manager/prisma/dev.db"
# Or relative to your project location
export PROJECT_MANAGER_DB="file:/path/to/project-manager/prisma/dev.db"
```

**Production:**
```bash
# For hosted database
export PROJECT_MANAGER_DB="postgresql://user:pass@host:port/db"
# Or MySQL
export PROJECT_MANAGER_DB="mysql://user:pass@host:port/db"
```

### Common Operations

**Query Your Project's Tasks:**
```bash
# Get all tasks for your project
sqlite3 $PROJECT_MANAGER_DB "
  SELECT pi.name, pi.type, pi.status, pi.priority, pi.description 
  FROM ProjectItem pi 
  JOIN Project p ON pi.projectId = p.id 
  WHERE p.name = 'YOUR_PROJECT_NAME' 
  ORDER BY pi.priority DESC, pi.createdAt ASC;
"

# Get high-priority TODO items
sqlite3 $PROJECT_MANAGER_DB "
  SELECT pi.name, pi.description, pi.priority 
  FROM ProjectItem pi 
  JOIN Project p ON pi.projectId = p.id 
  WHERE p.name = 'YOUR_PROJECT_NAME' 
  AND pi.priority IN ('HIGH', 'URGENT') 
  AND pi.status = 'TODO';
"
```

**Update Task Status:**
```bash
# Mark task as completed
sqlite3 $PROJECT_MANAGER_DB "
  UPDATE ProjectItem 
  SET status='COMPLETED', updatedAt=datetime('now') 
  WHERE name='TASK_NAME' 
  AND projectId=(SELECT id FROM Project WHERE name='YOUR_PROJECT_NAME');
"

# Mark task as in progress
sqlite3 $PROJECT_MANAGER_DB "
  UPDATE ProjectItem 
  SET status='IN_PROGRESS', updatedAt=datetime('now') 
  WHERE name='TASK_NAME' 
  AND projectId=(SELECT id FROM Project WHERE name='YOUR_PROJECT_NAME');
"
```

**Add New Tasks:**
```bash
# Add a new feature
sqlite3 $PROJECT_MANAGER_DB "
  INSERT INTO ProjectItem (id, projectId, name, description, type, status, priority, labels, createdAt, updatedAt)
  VALUES (
    lower(hex(randomblob(16))),
    (SELECT id FROM Project WHERE name='YOUR_PROJECT_NAME'),
    'New Feature Name',
    'Feature description',
    'FEATURE',
    'TODO',
    'MEDIUM',
    '[]',
    datetime('now'),
    datetime('now')
  );
"
```

### MCP Server Integration (Future)

When the Project Manager MCP server is available, you'll be able to use AI tools directly:
- AI assistants can query your project tasks
- Automatic status updates when you complete work
- Better integration with development workflow

## 🛠️ General Coding Practices

### Git Workflow
- **Commit regularly** - Don't let changes pile up
- **Use conventional commits** - `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- **Write meaningful commit messages** - Explain what and why, not just what
- **Create branches for features** - Don't work directly on main
- **Tag releases** - Use semantic versioning (v1.0.0, v1.1.0, etc.)

```bash
# Good commit examples
git commit -m "feat: add user authentication with JWT"
git commit -m "fix: resolve database connection timeout issue"
git commit -m "docs: update API documentation for new endpoints"
```

### Security Best Practices
- **Never commit secrets** - Use .env files for sensitive data
- **Add .env to .gitignore** - But include .env.example
- **Use environment variables** - For API keys, database URLs, etc.
- **Validate all inputs** - Sanitize user data
- **Keep dependencies updated** - Regular security updates
- **Use HTTPS everywhere** - Especially in production

```bash
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Code Quality
- **Use linting tools** - ESLint, Prettier, etc.
- **Write tests** - Unit tests, integration tests
- **Document your code** - Comments for complex logic
- **Follow naming conventions** - Consistent and descriptive names
- **Keep functions small** - Single responsibility principle
- **Handle errors properly** - Don't ignore exceptions

### Versioning & Releases
- **Use semantic versioning** - MAJOR.MINOR.PATCH
- **Tag releases in git** - `git tag v1.0.0`
- **Maintain a CHANGELOG** - Document what changed
- **Test before releasing** - Don't break production
- **Backup before major changes** - Safety first

### Documentation Standards
- **Keep README.md current** - Update as features change
- **Document API endpoints** - If you have an API
- **Include setup instructions** - For new developers
- **Add troubleshooting section** - Common issues and solutions

## 📝 Documentation Maintenance

### When to Update DEV.md
- **Add new tools or dependencies** - Document setup and usage
- **Change development workflow** - Update processes
- **Add project-specific practices** - Customize for your tech stack
- **Discover new best practices** - Share knowledge

### When to Update PLAN.md
- **Add new features** - Document what you plan to build
- **Change priorities** - Update what's important
- **Complete milestones** - Mark progress
- **Discover new requirements** - Add to backlog

### When to Update DEVLOG.md
- **Complete significant work** - Document what was done
- **Make important decisions** - Record reasoning
- **Solve difficult problems** - Share solutions
- **Learn something new** - Document insights

## 🎯 Project-Specific Customization

**Add your project-specific practices below:**

### [Your Tech Stack] Specific Practices
```
Example for Next.js projects:
- Use TypeScript for type safety
- Follow Next.js file-based routing conventions
- Use shadcn/ui for consistent UI components
- Implement proper SEO with metadata
- Use Prisma for database operations
- Deploy to Vercel for optimal performance
```

### Development Environment Setup
```
Add your specific setup instructions:
- Required Node.js version
- Database setup steps
- Environment variables needed
- Development server commands
- Testing commands
```

### Code Style Guidelines
```
Add your project's code style rules:
- Naming conventions
- File organization
- Import/export patterns
- Component structure (for frontend)
- API design patterns (for backend)
```

### Testing Strategy
```
Document your testing approach:
- Unit testing framework
- Integration testing setup
- E2E testing tools
- Coverage requirements
- Testing commands
```

### Deployment Process
```
Document your deployment workflow:
- Build process
- Environment setup
- Deployment commands
- Rollback procedures
- Monitoring setup
```

---

**Remember**: This DEV.md file should evolve with your project. Keep it updated and relevant to your current development practices!
