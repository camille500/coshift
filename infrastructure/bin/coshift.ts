#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';

const app = new cdk.App();

const domainName = app.node.tryGetContext('domainName') || 'coshift.nl';

new StaticSiteStack(app, 'CoShiftSite', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-west-1',
  },
  domainName,
  crossRegionReferences: true,
});
