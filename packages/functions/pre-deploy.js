#!/usr/bin/env node

/**
 * This script is used to replace "workspace:" protocol with "file:" protocol to make firebase deployment work with workspaces.
 * see: https://stackoverflow.com/questions/75785161/how-to-use-pnpm-workspace-protocol-and-deploy-firebase-functions
 */

const { existsSync, copyFileSync, readFileSync, writeFileSync } = require('fs')

const packagePath = './package.json'
const packageCopyPath = './package-copy.json'
const pnpmWorkspaceRegex = /workspace:/gi

// Abort if "package-copy.json" exists
if (existsSync(packageCopyPath)) {
    console.error(`"${packageCopyPath}" exists, previous deployment probably failed.`)
    return
}

// Copy "package.json" file
copyFileSync(packagePath, packageCopyPath)

// Read "package.json" file and replace "workspace:" to "file:" protocol
const packageBuffer = readFileSync(packagePath)
const packageContent = packageBuffer.toString()
const packageNewContent = packageContent.replace(pnpmWorkspaceRegex, 'file:')

writeFileSync(packagePath, packageNewContent)