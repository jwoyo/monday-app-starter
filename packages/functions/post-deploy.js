#!/usr/bin/env node

const { rmSync, renameSync } = require('fs')

const packagePath = './package.json'
const packageCopyPath = './package-copy.json'

// Restore original "package.json" file with "workspace:" protocol
rmSync(packagePath)
renameSync(packageCopyPath, packagePath)