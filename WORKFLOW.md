---
stack: nextjs
branch_target: main
package_manager: npm
build_command: npm run build
deploy: auto (Dokploy on merge to main)
---

# JD Builds Portfolio — Agent Workflow

## Before You Start
1. `git checkout main && git pull`
2. Create a feature branch: `git checkout -b fix/<short-description>`

## Stack
- Next.js 15, Tailwind CSS, Framer Motion, Geist fonts
- Design: monochrome dark (#0a0a0b) + orange accent (#f97316)
- Particle system: canvas-based code characters forming world map
- Deployed on Dokploy (panel.jdbuilds.ca)

## Rules
- Run `npm run build` before committing
- PR target: `main` branch
- Maintain the design language — monochrome + orange
- Don't break the particle system animation

## After Your Change
1. `git add -A && git commit -m "<type>: <description>"`
2. `git push -u origin <branch>`
3. `gh pr create --repo jonahduckworth/portfolio --base main --fill`
4. Lisa QA will review your PR automatically
