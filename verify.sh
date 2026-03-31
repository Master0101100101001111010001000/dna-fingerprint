#!/bin/bash

###
# Copyright (c) 2026. All Rights Reserved.
# Proprietary and Confidential.
#
# System Verification Script
###

echo "🧬 DNA Fingerprinting System - Verification"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS="${GREEN}✓${NC}"
FAIL="${RED}✗${NC}"
WARN="${YELLOW}⚠${NC}"

# Track results
ERRORS=0

echo "1. Checking directory structure..."
if [ -d "shared" ] && [ -d "backend" ] && [ -d "frontend" ]; then
    echo -e "   $PASS Directories exist"
else
    echo -e "   $FAIL Missing directories"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "2. Checking core files..."
FILES=("shared/dna-engine.js" "shared/rewriter.js" "backend/server.js" "frontend/src/App.jsx")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   $PASS $file"
    else
        echo -e "   $FAIL $file missing"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "3. Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "   $PASS Node.js $NODE_VERSION"
else
    echo -e "   $FAIL Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "4. Checking npm packages..."
if [ -d "node_modules" ]; then
    echo -e "   $PASS Root packages installed"
else
    echo -e "   $WARN Root packages not installed (run: npm install)"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "   $PASS Backend packages installed"
else
    echo -e "   $WARN Backend packages not installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "   $PASS Frontend packages installed"
else
    echo -e "   $WARN Frontend packages not installed (run: cd frontend && npm install)"
fi

echo ""
echo "5. Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo -e "   $PASS backend/.env exists"
    if grep -q "ANTHROPIC_API_KEY" backend/.env; then
        echo -e "   $PASS ANTHROPIC_API_KEY configured"
    else
        echo -e "   $WARN ANTHROPIC_API_KEY not set in .env"
    fi
else
    echo -e "   $WARN backend/.env not found (copy from .env.example)"
fi

echo ""
echo "6. Testing DNA engine..."
if node test-engine.js > /dev/null 2>&1; then
    echo -e "   $PASS DNA engine test passed"
else
    echo -e "   $FAIL DNA engine test failed (run: node test-engine.js)"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "7. Checking port availability..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "   $WARN Port 3001 already in use (backend port)"
else
    echo -e "   $PASS Port 3001 available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "   $WARN Port 3000 already in use (frontend port)"
else
    echo -e "   $PASS Port 3000 available"
fi

echo ""
echo "==========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "You can now run the system with:"
    echo "  ./start.sh"
    echo "  or"
    echo "  npm run dev"
    exit 0
else
    echo -e "${RED}✗ $ERRORS critical error(s) found${NC}"
    echo ""
    echo "Please fix the errors above before running."
    exit 1
fi
