// TODO: Delete this file (data fetched from glowstats)

const GRAPHQL_QUERY = {
  query: `
    {
      protocolFeePaymentsPerWeeks(
        orderBy: totalPayments
        first: 1000
        orderDirection: desc
      ) {
          id
          totalPayments
      }
    }
  `
};

interface ProtocolFeePayment {
  id: string;
  totalPayments: string;
}

function sortProtocolFeePaymentsDesc(data: ProtocolFeePayment[]): ProtocolFeePayment[] {
  return data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || '';

export async function weeklyProtocolFees() {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(GRAPHQL_QUERY),
  });

  const data = await response.json();
  sortProtocolFeePaymentsDesc(data.data.protocolFeePaymentsPerWeeks);

  return {protocolFeesPerWeek: data.data.protocolFeePaymentsPerWeeks};
}



const getCumulativeFees = (protocolFeesPerWeek: ProtocolFeePayment[]) => {
  const cumulativeFeesList: number[] = [];
  let cumulativeFees = 0;
  for (let i = protocolFeesPerWeek.length - 1; i > 0; i--) {
    const fee = Number(protocolFeesPerWeek[i].totalPayments) / 1000000;
    cumulativeFees += fee;
    const formattedCumulativeFees = Math.round(cumulativeFees * 100) / 100;
    cumulativeFeesList.unshift(formattedCumulativeFees);
  }

  return cumulativeFeesList;
}
