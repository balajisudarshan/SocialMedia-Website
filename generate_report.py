from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib import colors
from datetime import datetime

doc = SimpleDocTemplate(
    "CollabSpace_Bug_Features_Report.pdf",
    pagesize=letter,
    rightMargin=0.5*inch,
    leftMargin=0.5*inch,
    topMargin=0.5*inch,
    bottomMargin=0.5*inch
)

styles = getSampleStyleSheet()
story = []

# Title Page
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=28,
    textColor=colors.HexColor('#1a1a1a'),
    spaceAfter=6,
    alignment=1
)

subtitle_style = ParagraphStyle(
    'Subtitle',
    parent=styles['Normal'],
    fontSize=14,
    textColor=colors.HexColor('#666666'),
    spaceAfter=30,
    alignment=1
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=16,
    textColor=colors.HexColor('#2c3e50'),
    spaceAfter=10,
    spaceBefore=12
)

section_style = ParagraphStyle(
    'SectionHeading',
    parent=styles['Heading3'],
    fontSize=12,
    textColor=colors.HexColor('#34495e'),
    spaceAfter=8,
    spaceBefore=6
)

# Title and Introduction
story.append(Paragraph("CollabSpace", title_style))
story.append(Paragraph("Developer Collaboration Platform", subtitle_style))
story.append(Paragraph(f"<b>Bug Report & Feature Status</b>", subtitle_style))
story.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", styles['Normal']))
story.append(Spacer(1, 0.3*inch))

# Summary Box
summary_data = [
    ['REPORT SUMMARY', ''],
    ['Total Bugs Identified', '14'],
    ['Critical Bugs', '4'],
    ['Medium Priority Bugs', '7'],
    ['Low Priority Bugs', '3'],
    ['Missing Features', '15'],
    ['Improvement Areas', '10'],
]
summary_table = Table(summary_data, colWidths=[3.5*inch, 1.5*inch])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 12),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
]))
story.append(summary_table)
story.append(Spacer(1, 0.3*inch))
story.append(PageBreak())

# CRITICAL BUGS SECTION
story.append(Paragraph("🔴 CRITICAL BUGS (Must Fix)", heading_style))
story.append(Spacer(1, 0.15*inch))

critical_bugs = [
    {
        'title': '1. Request Management Endpoint Mismatch',
        'file': 'frontend/src/app/requests/page.js',
        'line': 'Line 24 & 29',
        'description': 'The requests page fetches connection requests from "/connection/getMyRequests" but manages them via "/project/request/{id}/{type}" endpoint. This causes connection requests and project requests to be mixed up.',
        'impact': 'Connection requests cannot be properly accepted/rejected',
        'fix': 'Use consistent endpoints: "/connection/request/{id}/{type}" for connection management'
    },
    {
        'title': '2. User Data Structure Bug in Project View',
        'file': 'frontend/src/app/projects/view/[id]/page.js',
        'line': 'Line 93',
        'description': 'The isOwner check uses "user.user._id" but the useAuth hook returns user directly with _id property. This causes undefined reference errors.',
        'impact': 'Owner cannot see edit/delete options for their projects',
        'fix': 'Change "user?.user?._id" to "user?._id"'
    },
    {
        'title': '3. No Error Response Status Code',
        'file': 'backend/controllers/Auth.controller.js, Project.controller.js',
        'line': 'Various',
        'description': 'Some error handlers don\'t set proper HTTP status codes (e.g., missing res.status(500))',
        'impact': 'Frontend cannot properly detect errors for UI feedback',
        'fix': 'Add proper status codes to all error responses'
    },
    {
        'title': '4. Missing Redirect After Login',
        'file': 'frontend/src/app/login/page.js',
        'line': 'Unknown',
        'description': 'After successful login, user is not redirected to dashboard/home',
        'impact': 'Users stay on login page after successful authentication',
        'fix': 'Add router.push("/") after successful login'
    },
]

for i, bug in enumerate(critical_bugs, 1):
    story.append(Paragraph(f"<b>{bug['title']}</b>", section_style))
    bug_details = f"""
    <b>File:</b> {bug['file']}<br/>
    <b>Location:</b> {bug['line']}<br/>
    <b>Description:</b> {bug['description']}<br/>
    <b>Impact:</b> {bug['impact']}<br/>
    <b>Recommended Fix:</b> {bug['fix']}
    """
    story.append(Paragraph(bug_details, styles['Normal']))
    story.append(Spacer(1, 0.15*inch))

story.append(PageBreak())

# MEDIUM PRIORITY BUGS
story.append(Paragraph("🟠 MEDIUM PRIORITY BUGS", heading_style))
story.append(Spacer(1, 0.15*inch))

medium_bugs = [
    {
        'title': '5. Missing Request Status Handling',
        'file': 'frontend/src/app/projects/view/[id]/page.js',
        'description': 'RequestStatus is fetched but may return {status: null} which isn\'t handled properly in UI',
        'fix': 'Add conditional rendering based on requestStatus value'
    },
    {
        'title': '6. No Input Validation in Forms',
        'file': 'frontend/src/app/projects/create/page.js',
        'description': 'Project creation form doesn\'t validate empty fields before submission',
        'fix': 'Add required field validation before API call'
    },
    {
        'title': '7. Missing Loading States',
        'file': 'frontend/src/app/requests/page.js, profile/[id]/page.js',
        'description': 'Several pages don\'t show loading states while fetching data',
        'fix': 'Add skeleton loaders or spinners during data fetching'
    },
    {
        'title': '8. No User Interaction on Profile',
        'file': 'frontend/src/app/profile/[id]/page.js',
        'description': 'Profile page displays user info but has no "Connect" button or any action buttons',
        'fix': 'Add connect button functionality to send connection request'
    },
    {
        'title': '9. Unhandled Promise in useEffect',
        'file': 'frontend/src/context/AuthContext.jsx',
        'description': 'fetchUser doesn\'t handle loading state properly before initial render',
        'fix': 'Add proper loading state management in AuthContext'
    },
    {
        'title': '10. Missing Error Boundaries',
        'file': 'frontend/src/app/layout.js',
        'description': 'No error boundary component to catch React errors',
        'fix': 'Create error.js files for each route as per Next.js App Router'
    },
    {
        'title': '11. No Toast for Success Messages',
        'file': 'frontend/src/app/requests/page.js',
        'description': 'Request acceptance/rejection doesn\'t show success feedback to user',
        'fix': 'Add toast notifications using sonner library'
    },
]

for bug in medium_bugs:
    story.append(Paragraph(f"<b>{bug['title']}</b>", section_style))
    story.append(Paragraph(f"{bug['description']}<br/><b>Fix:</b> {bug['fix']}<br/><b>File:</b> {bug['file']}", styles['Normal']))
    story.append(Spacer(1, 0.1*inch))

story.append(PageBreak())

# LOW PRIORITY BUGS
story.append(Paragraph("🟡 LOW PRIORITY BUGS", heading_style))
story.append(Spacer(1, 0.15*inch))

low_bugs = [
    '12. Console.log statements left in production code',
    '13. Inconsistent error logging (some use console.log, some use console.error)',
    '14. No environment variable validation at startup',
]

for bug in low_bugs:
    story.append(Paragraph(f"• {bug}", styles['Normal']))
    story.append(Spacer(1, 0.05*inch))

story.append(Spacer(1, 0.2*inch))
story.append(PageBreak())

# MISSING FEATURES
story.append(Paragraph("✨ MISSING FEATURES (Priority Order)", heading_style))
story.append(Spacer(1, 0.15*inch))

story.append(Paragraph("<b>HIGH PRIORITY (Core Functionality):</b>", section_style))
features_high = [
    '1. <b>Edit Project:</b> Ability to modify project details, tech stack, visibility, tags',
    '2. <b>Delete Project:</b> Ability to remove projects (with confirmation)',
    '3. <b>Edit User Profile:</b> Update bio, skills, avatar, contact links',
    '4. <b>Profile Avatar Upload:</b> Users cannot upload profile pictures',
    '5. <b>User Search:</b> No search functionality to find specific users by username',
    '6. <b>Project Search:</b> No search/filter for projects by name, tags, tech stack',
    '7. <b>Password Reset:</b> No forgot password functionality',
    '8. <b>Email Verification:</b> No email verification for accounts',
]

for feature in features_high:
    story.append(Paragraph(feature, styles['Normal']))
    story.append(Spacer(1, 0.08*inch))

story.append(Spacer(1, 0.15*inch))
story.append(Paragraph("<b>MEDIUM PRIORITY (Enhancement):</b>", section_style))
features_medium = [
    '9. <b>Real-time Notifications:</b> Socket.io is installed but not implemented',
    '10. <b>Project Comments:</b> Comments/discussion feature for projects',
    '11. <b>User Blocking:</b> Block/unblock users functionality',
    '12. <b>Pagination:</b> Large datasets need pagination',
    '13. <b>Sorting Options:</b> Sort projects by date, popularity, followers',
    '14. <b>Activity Feed:</b> User activity timeline/feed',
    '15. <b>Admin Dashboard:</b> Admin panel for managing users and projects',
]

for feature in features_medium:
    story.append(Paragraph(feature, styles['Normal']))
    story.append(Spacer(1, 0.08*inch))

story.append(PageBreak())

# IMPROVEMENTS NEEDED
story.append(Paragraph("🔧 CODE QUALITY & IMPROVEMENTS", heading_style))
story.append(Spacer(1, 0.15*inch))

improvements = [
    {
        'category': 'Error Handling',
        'items': [
            'Add try-catch blocks in all API calls',
            'Create custom error handler middleware',
            'Show user-friendly error messages',
            'Implement error logging service'
        ]
    },
    {
        'category': 'Security',
        'items': [
            'Input sanitization and validation',
            'Rate limiting on API endpoints',
            'CSRF protection',
            'SQL injection prevention (already using MongoDB)'
        ]
    },
    {
        'category': 'Database',
        'items': [
            'Add database indexes for frequently queried fields',
            'Implement caching for repeated queries',
            'Better query optimization',
            'Connection pooling configuration'
        ]
    },
    {
        'category': 'Testing',
        'items': [
            'Unit tests for controllers',
            'Integration tests for API endpoints',
            'Frontend component testing',
            'E2E tests for critical user flows'
        ]
    },
    {
        'category': 'Code Organization',
        'items': [
            'Extract repeated logic into utilities',
            'Create service layer for complex operations',
            'Better separation of concerns',
            'DRY principle implementation'
        ]
    },
    {
        'category': 'Documentation',
        'items': [
            'JSDoc comments for functions',
            'API endpoint documentation',
            'Setup instructions improvement',
            'Deployment guide completion'
        ]
    },
]

for improvement in improvements:
    story.append(Paragraph(f"<b>{improvement['category']}:</b>", section_style))
    for item in improvement['items']:
        story.append(Paragraph(f"• {item}", styles['Normal']))
    story.append(Spacer(1, 0.12*inch))

story.append(PageBreak())

# RECOMMENDATIONS & ACTION PLAN
story.append(Paragraph("📋 RECOMMENDED ACTION PLAN", heading_style))
story.append(Spacer(1, 0.15*inch))

action_plan = """
<b>PHASE 1 - Critical Fixes (Week 1):</b><br/>
• Fix endpoint mismatch in requests page<br/>
• Fix user data structure bug in project view<br/>
• Add proper error status codes<br/>
• Add redirect after login<br/>
<br/>

<b>PHASE 2 - Core Features (Week 2-3):</b><br/>
• Implement edit/delete project functionality<br/>
• Implement edit user profile features<br/>
• Add search functionality (users and projects)<br/>
• Implement password reset flow<br/>
<br/>

<b>PHASE 3 - Enhancements (Week 4+):</b><br/>
• Implement real-time notifications with Socket.io<br/>
• Add project comments/discussion<br/>
• Implement pagination for large datasets<br/>
• Add comprehensive testing<br/>
<br/>

<b>ONGOING:</b><br/>
• Code review and refactoring<br/>
• Performance optimization<br/>
• Security audits<br/>
• User feedback integration<br/>
"""

story.append(Paragraph(action_plan, styles['Normal']))
story.append(Spacer(1, 0.3*inch))

# FINAL STATS
story.append(Paragraph("QUICK STATS", heading_style))
story.append(Spacer(1, 0.1*inch))

stats_data = [
    ['Metric', 'Count', 'Status'],
    ['API Endpoints', '~15', '✓ Implemented'],
    ['Frontend Pages', '8', '✓ Implemented'],
    ['Database Collections', '5', '✓ Implemented'],
    ['Authentication', 'JWT + Cookies', '✓ Implemented'],
    ['Real-time Features', 'Socket.io', '✗ Not Used'],
    ['Tests Coverage', '0%', '✗ None'],
    ['Documentation', 'Excellent', '✓ Complete'],
]

stats_table = Table(stats_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
stats_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 11),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
    ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ('FONTSIZE', (0, 1), (-1, -1), 10),
    ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
]))
story.append(stats_table)

# Build PDF
doc.build(story)
print("✓ PDF Report generated successfully: CollabSpace_Bug_Features_Report.pdf")
