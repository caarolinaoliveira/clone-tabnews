import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 10000,
    });
  }
  async function fetchStatusPage() {
    const response = await fetch(
      "https://carolinaoliveira-dev.com.br/api/v1/status",
    );
    if (response.status !== 200) {
      throw Error(`Unexpected status code: ${response.status}`);
    }
  }
}

const orchestrator = {
  waitForAllServices,
};
export default orchestrator;
