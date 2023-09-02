export async function load({ fetch }) {
  const contributions = await (await fetch("sonukuldeep/2023")).json();
  return { contributions };
}
