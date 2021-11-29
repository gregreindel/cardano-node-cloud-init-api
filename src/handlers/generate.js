const shell = require("shelljs");
const { responseWrapper } = require("../utils/responseWrapper")
const { getFileContents } = require("../utils/getFileContents")
const {
  validateIPv4,
  validateSwap,
  isValidHostname,
  validateSSHPort,
  hasIllegalCharacters
} = require("../utils/validators")

const {
  CARDANO_NODE_BUILDER_API_MODE = "local",
  CARDANO_NODE_BUILDER_PATH,
  CARDANO_NODE_BUILDER_OUTPUT_DIR = "",
} = process.env;


exports.generateRequestHandler = async (event, context) => {
  const { httpMethod, queryStringParameters = {} } = event;
  const { awsRequestId } = context;
  const {
    network,
    version,
    sshKey,
    sshPort,
    prepareRelayNode,
    prepareBlockNode,
    prepareDashboard,
    dashboardUseWhitelistIp,
    dashboardWhitelistIp,
    relayNode1Hostname,
    relayNode2Hostname,
    relayNode1Ip,
    relayNode2Ip,
    blockNodeIp,
    bundleSetupScripts,
    numberRelayNodes,
    blockNodeSwap,
    relayNodeSwap,
    doAutoInit,
  } = queryStringParameters;


  if(!CARDANO_NODE_BUILDER_PATH){
    return responseWrapper(400, `Missing build script path`);
  }
  
  const path = `${CARDANO_NODE_BUILDER_PATH}/cardano-cloud.sh`;
  const uniquePathForOutput = `${
    CARDANO_NODE_BUILDER_OUTPUT_DIR
      ? CARDANO_NODE_BUILDER_OUTPUT_DIR
      : CARDANO_NODE_BUILDER_PATH
  }/out/${awsRequestId}`;

  try {

    if (httpMethod !== "GET") {
      throw new Error(`Invalid method`);
    }

    if (!network || !["mainnet", "testnet"].includes(network)) {
      throw new Error(`Invalid network`);
    }

    if (!version || !["1.29.0", "1.30.0", "latest"].includes(version)) {
      throw new Error(`Invalid version`);
    }

    if (
      !sshKey ||
      !sshKey.includes("ssh-rsa") ||
      sshKey.length < 200 ||
      sshKey.length > 1000 ||
      hasIllegalCharacters(sshKey)
    ) {
      throw new Error(`Problem with SSH key`);
    }

    if (
      !sshPort ||
      !validateSSHPort(sshPort) ||
      hasIllegalCharacters(sshPort)
    ) {
      throw new Error(`Problem with SSH port`);
    }

    if (
      (relayNode1Hostname && !isValidHostname(relayNode1Hostname)) ||
      hasIllegalCharacters(relayNode1Hostname)
    ) {
      throw new Error(`Invalid hostname ${relayNode1Hostname}`);
    }

    if (
      (relayNode2Hostname && !isValidHostname(relayNode2Hostname)) ||
      hasIllegalCharacters(relayNode2Hostname)
    ) {
      throw new Error(`Invalid hostname ${relayNode2Hostname}`);
    }

    if (dashboardUseWhitelistIp && dashboardWhitelistIp) {
      if (!validateIPv4(dashboardWhitelistIp)) {
        throw new Error(
          `Problem with dashboard viewing whitelist IP ${dashboardWhitelistIp}`
        );
      }
    }

    if (relayNode1Ip) {
      if (!validateIPv4(relayNode1Ip)) {
        throw new Error(`Problem with Relay IP ${relayNode1Ip}`);
      }
    }

    if (relayNode2Ip) {
      if (!validateIPv4(relayNode2Ip)) {
        throw new Error(`Problem with Relay IP ${relayNode2Ip}`);
      }
    }

    if (blockNodeIp) {
      if (!validateIPv4(blockNodeIp)) {
        throw new Error(`Problem with Block IP ${blockNodeIp}`);
      }
    }

    if (blockNodeSwap) {
      if (!validateSwap(blockNodeSwap)) {
        throw new Error(`Problem with Block Swap ${blockNodeSwap}`);
      }
    }

    if (relayNodeSwap) {
      if (!validateSwap(relayNodeSwap)) {
        throw new Error(`Problem with Relay Swap ${relayNodeSwap}`);
      }
    }

    const flags = [
      `-id "${awsRequestId}"`,
      `--network "${network}"`,
      `--version "${version}"`,
      `--ssh-key "${sshKey}"`,
      `--ssh-port "${sshPort}"`,
    ];

    if(doAutoInit){
      flags.push(`--auto-init`);
    }
    
    if (prepareRelayNode) {
      flags.push(`--output-relay`);
    }

    if (prepareBlockNode) {
      flags.push(`--output-block`);
    }

    if (prepareDashboard) {
      flags.push(`--output-dashboard`);
    }

    if (relayNode1Hostname) {
      flags.push(`--rnhost1 "${relayNode1Hostname}"`);
    }

    if (relayNode2Hostname) {
      flags.push(`--rnhost2 "${relayNode2Hostname}"`);
    }

    if (bundleSetupScripts === "true") {
      flags.push(`--bundle`);
    }

    if (relayNode1Ip) {
      flags.push(`--rnip1 "${relayNode1Ip}"`);
    }

    if (relayNode2Ip) {
      flags.push(`--rnip2 "${relayNode2Ip}"`);
    }

    if (blockNodeIp) {
      flags.push(`--bnip1 "${blockNodeIp}"`);
    }

    if (blockNodeSwap) {
      flags.push(`--bnswap "${blockNodeSwap}"`);
    }

    if (relayNodeSwap) {
      flags.push(`--rnswap "${relayNodeSwap}"`);
    }

    // production means were running on AWS Lambda
    // need to copy the scripts from where layers get installed
    if (CARDANO_NODE_BUILDER_API_MODE === "production") {
      shell.cp("-R", "/opt/cardano-node-cloud-init", `${CARDANO_NODE_BUILDER_PATH}`);
    }

    shell.chmod("755", `${CARDANO_NODE_BUILDER_PATH}/cardano-cloud.sh`);
    shell.exec(`${path} ${flags.join(" \\")}`);

    const blockUserData = getFileContents(uniquePathForOutput, `block-1-user-data.yaml`);
    const blockSetup = getFileContents(uniquePathForOutput, `block-1-setup.yaml`);
    const blockUserDataSetupCombined = getFileContents(uniquePathForOutput, `block-1-user-data-combined.yaml`);

    const relay1UserData = getFileContents(uniquePathForOutput, `relay-1-user-data.yaml`);
    const relay1Setup = getFileContents(uniquePathForOutput, `relay-1-setup.yaml`);
    const relay1UserDataSetupCombined = getFileContents(uniquePathForOutput, `relay-1-user-data-combined.yaml`);
    const relay2UserData = getFileContents(uniquePathForOutput, `relay-2-user-data.yaml`);
    const relay2Setup = getFileContents(uniquePathForOutput, `relay-2-setup.yaml`);
    const relay2UserDataSetupCombined = getFileContents(uniquePathForOutput, `relay-1-user-data-combined.yaml`);

    const dashboardUserData = getFileContents(uniquePathForOutput, `dashboard-user-data.yaml`);

    const responseBody = {};

    if (prepareRelayNode) {
      responseBody['relay'] = {
        combined: relay1UserDataSetupCombined,
        userData: relay1UserData,
        setupScripts: relay1Setup,
      }
      if(numberRelayNodes > 1){
        responseBody['relay2'] = {
          combined: relay2UserDataSetupCombined,
          userData: relay2UserData,
          setupScripts: relay2Setup,
        }
      }
    }

    if (prepareBlockNode) {
      responseBody['block'] = {
        combined: blockUserDataSetupCombined,
        userData: blockUserData,
        setupScripts: blockSetup,
      }
    }

    if (prepareDashboard) {
      responseBody['dashboard'] = {
        userData: dashboardUserData,
      }
    }

    return responseWrapper(200, responseBody);
  } catch (error) {
    return responseWrapper(400, error.message);
  } finally {
    if (CARDANO_NODE_BUILDER_API_MODE === "production") {
      shell.rm("-rf", uniquePathForOutput);
    }
  }
};
