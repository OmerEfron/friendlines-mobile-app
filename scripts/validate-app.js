#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Friendlines Mobile App Validation...\n');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

function success(message) {
  log(colors.green, '✅', message);
}

function error(message) {
  log(colors.red, '❌', message);
}

function warning(message) {
  log(colors.yellow, '⚠️', message);
}

function info(message) {
  log(colors.blue, 'ℹ️', message);
}

function header(message) {
  console.log(`\n${colors.bold}${colors.blue}=== ${message} ===${colors.reset}\n`);
}

let validationResults = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function runCheck(description, command, optional = false) {
  info(`Running: ${description}`);
  try {
    execSync(command, { stdio: 'pipe' });
    success(`${description} - PASSED`);
    validationResults.passed++;
    return true;
  } catch (err) {
    if (optional) {
      warning(`${description} - SKIPPED (optional)`);
      validationResults.warnings++;
      return false;
    } else {
      error(`${description} - FAILED`);
      console.log(`Error: ${err.message}`);
      validationResults.failed++;
      return false;
    }
  }
}

function checkFileExists(filePath, description) {
  info(`Checking: ${description}`);
  if (fs.existsSync(filePath)) {
    success(`${description} - EXISTS`);
    validationResults.passed++;
    return true;
  } else {
    error(`${description} - MISSING`);
    validationResults.failed++;
    return false;
  }
}

function checkDirectoryStructure() {
  header('Directory Structure Validation');
  
  const requiredDirs = [
    'src/components',
    'src/screens',
    'src/hooks',
    'src/contexts',
    'src/services',
    'src/utils',
    'src/types',
    'src/styles',
    'src/navigation',
    'src/__tests__'
  ];

  requiredDirs.forEach(dir => {
    checkFileExists(dir, `Directory: ${dir}`);
  });

  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'jest.config.js',
    'jest.setup.js',
    'app.json',
    'App.tsx',
    'src/styles/theme.ts',
    'src/types/index.ts'
  ];

  requiredFiles.forEach(file => {
    checkFileExists(file, `File: ${file}`);
  });
}

function validatePackageJson() {
  header('Package.json Validation');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check required scripts
    const requiredScripts = ['start', 'test', 'type-check'];
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        success(`Script '${script}' is defined`);
        validationResults.passed++;
      } else {
        error(`Script '${script}' is missing`);
        validationResults.failed++;
      }
    });

    // Check required dependencies
    const requiredDeps = [
      'expo',
      'react',
      'react-native',
      '@react-navigation/native',
      '@tanstack/react-query'
    ];

    requiredDeps.forEach(dep => {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        success(`Dependency '${dep}' is installed`);
        validationResults.passed++;
      } else {
        error(`Dependency '${dep}' is missing`);
        validationResults.failed++;
      }
    });

  } catch (err) {
    error('Failed to parse package.json');
    validationResults.failed++;
  }
}

function validateTypeScript() {
  header('TypeScript Validation');
  
  runCheck('TypeScript compilation', 'npm run type-check');
  
  // Check tsconfig.json
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
      success('TypeScript strict mode is enabled');
      validationResults.passed++;
    } else {
      warning('TypeScript strict mode is not enabled');
      validationResults.warnings++;
    }
  } catch (err) {
    error('Failed to parse tsconfig.json');
    validationResults.failed++;
  }
}

function runTests() {
  header('Test Suite Validation');
  
  runCheck('Unit tests', 'npm test -- --passWithNoTests --verbose=false');
  runCheck('Test coverage', 'npm run test:coverage -- --passWithNoTests --verbose=false', true);
}

function validateExpoConfig() {
  header('Expo Configuration Validation');
  
  try {
    const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
    const expo = appJson.expo;
    
    if (expo) {
      success('Expo configuration found');
      validationResults.passed++;
      
      // Check required fields
      const requiredFields = ['name', 'slug', 'version', 'platforms'];
      requiredFields.forEach(field => {
        if (expo[field]) {
          success(`Expo config has '${field}'`);
          validationResults.passed++;
        } else {
          error(`Expo config missing '${field}'`);
          validationResults.failed++;
        }
      });

      // Check New Architecture
      if (expo.newArchEnabled === true) {
        success('New Architecture is enabled');
        validationResults.passed++;
      } else {
        warning('New Architecture is not enabled');
        validationResults.warnings++;
      }

      // Check SDK version
      if (expo.sdkVersion && expo.sdkVersion.startsWith('53')) {
        success('Using Expo SDK 53');
        validationResults.passed++;
      } else {
        warning('Not using Expo SDK 53');
        validationResults.warnings++;
      }

    } else {
      error('Expo configuration not found');
      validationResults.failed++;
    }
  } catch (err) {
    error('Failed to parse app.json');
    validationResults.failed++;
  }
}

function validateBuildProcess() {
  header('Build Process Validation');
  
  // Check if we can create a development build
  runCheck('Expo prebuild (dry run)', 'npx expo prebuild --dry-run', true);
  
  // Check bundle
  info('Checking bundle creation...');
  try {
    execSync('npx expo export --dev', { stdio: 'pipe' });
    success('Development bundle creation - PASSED');
    validationResults.passed++;
  } catch (err) {
    error('Development bundle creation - FAILED');
    validationResults.failed++;
  }
}

function checkAccessibility() {
  header('Accessibility Validation');
  
  // Check if components have accessibility props
  const componentFiles = [
    'src/components/common/Button.tsx',
    'src/components/common/Input.tsx'
  ];

  componentFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('accessibilityRole') || content.includes('accessibilityLabel')) {
        success(`${file} has accessibility props`);
        validationResults.passed++;
      } else {
        warning(`${file} missing accessibility props`);
        validationResults.warnings++;
      }
    }
  });
}

function generateReport() {
  header('Validation Report');
  
  const total = validationResults.passed + validationResults.failed + validationResults.warnings;
  const passRate = ((validationResults.passed / total) * 100).toFixed(1);
  
  console.log(`${colors.bold}Summary:${colors.reset}`);
  console.log(`✅ Passed: ${colors.green}${validationResults.passed}${colors.reset}`);
  console.log(`❌ Failed: ${colors.red}${validationResults.failed}${colors.reset}`);
  console.log(`⚠️  Warnings: ${colors.yellow}${validationResults.warnings}${colors.reset}`);
  console.log(`📊 Pass Rate: ${passRate >= 80 ? colors.green : colors.red}${passRate}%${colors.reset}\n`);

  if (validationResults.failed === 0) {
    success('🎉 All critical validations passed! App is ready for testing.');
    return true;
  } else {
    error('❌ Some critical validations failed. Please fix before proceeding.');
    return false;
  }
}

async function main() {
  try {
    checkDirectoryStructure();
    validatePackageJson();
    validateTypeScript();
    runTests();
    validateExpoConfig();
    checkAccessibility();
    validateBuildProcess();
    
    const success = generateReport();
    process.exit(success ? 0 : 1);
    
  } catch (err) {
    error(`Validation script failed: ${err.message}`);
    process.exit(1);
  }
}

// Run the validation
main(); 