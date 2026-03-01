import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

interface StaticSiteStackProps extends cdk.StackProps {
  domainName: string;
}

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const { domainName } = props;

    // S3 bucket for static site files
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: `${domainName}-site`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
    });

    // CloudFront Origin Access Identity
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${domainName}`,
    });
    siteBucket.grantRead(originAccessIdentity);

    // CloudFront Function for SPA routing (handle /path → /path/index.html)
    const rewriteFunction = new cloudfront.Function(this, 'RewriteFunction', {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          var uri = request.uri;

          // If URI ends with '/' add index.html
          if (uri.endsWith('/')) {
            request.uri += 'index.html';
          }
          // If URI doesn't have an extension, add /index.html
          else if (!uri.includes('.')) {
            request.uri += '/index.html';
          }

          return request;
        }
      `),
      functionName: 'CoShiftRewrite',
    });

    // Look up the hosted zone (must already exist in Route53)
    // Comment out until domain is registered:
    // const hostedZone = route53.HostedZone.fromLookup(this, 'Zone', {
    //   domainName,
    // });

    // ACM certificate (must be in us-east-1 for CloudFront)
    // Comment out until domain is registered:
    // const certificate = new acm.Certificate(this, 'Certificate', {
    //   domainName,
    //   subjectAlternativeNames: [`www.${domainName}`],
    //   validation: acm.CertificateValidation.fromDns(hostedZone),
    // });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [{
          function: rewriteFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responsePagePath: '/404.html',
          responseHttpStatus: 404,
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 403,
          responsePagePath: '/404.html',
          responseHttpStatus: 404,
          ttl: cdk.Duration.minutes(5),
        },
      ],
      // Uncomment when domain is ready:
      // domainNames: [domainName, `www.${domainName}`],
      // certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // Europe & North America only (cheapest)
    });

    // Deploy site files to S3
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [s3deploy.Source.asset('../site/dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // Route53 records (uncomment when domain is registered)
    // new route53.ARecord(this, 'AliasRecord', {
    //   zone: hostedZone,
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    //   recordName: domainName,
    // });
    //
    // new route53.AaaaRecord(this, 'AliasRecordIPv6', {
    //   zone: hostedZone,
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    //   recordName: domainName,
    // });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: siteBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'Use this URL to test before custom domain is set up',
    });
  }
}
