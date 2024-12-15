/** @param {NS} ns */
export async function main(ns) {
    const dest = ns.args[0]; // Destination server name
    if (!dest) {
        ns.tprint("Usage: run traceroute.js <destination>");
        return;
    }

    let routeList = [["home"]]; // Queue of routes to explore
    const visited = new Set(); // Keep track of visited servers

    while (routeList.length > 0) {
        // Dequeue the first route from the list
        const route = routeList.shift();
        const currentServer = route[route.length - 1];

        // Mark the server as visited
        visited.add(currentServer);

        // If the destination is found, print the traceroute and exit
        if (currentServer === dest) {
            await printTraceroute(ns, route);
            return;
        }

        // Get the next servers to visit
        const nextHops = ns.scan(currentServer);

        for (const hop of nextHops) {
            if (!visited.has(hop)) {
                // Add the new hop to the current route and enqueue it
                const newRoute = [...route, hop];
                routeList.push(newRoute);
            }
        }
    }

    // If we exit the loop without finding the destination
    ns.tprint(`Server "${dest}" not found.`);
}

/**
 * Prints a realistic traceroute output for a given route with proper spacing.
 * @param {NS} ns
 * @param {string[]} route
 */
async function printTraceroute(ns, route) {
    let target = route[route.length - 1];
    ns.tprint(`Tracing route to ${target} [${ns.getServer(target).ip}]:\n`);

    // Determine column widths for alignment
    const maxHopLength = String(route.length).length;

    for (let i = 0; i < route.length; i++) {
        const server = route[i];
        const serverInfo = ns.getServer(server); // Get server information
        const ip = serverInfo.ip; // Get server IP address

        // Simulate network latency
        const wait = 1000 * Math.random();
        await ns.sleep(wait);

        // Format output with aligned columns
        ns.tprint(
            `${String(i + 1).padEnd(maxHopLength)}\t${ns.formatNumber(wait / 100, 1)}ms\t${server} [${ip}]`
        );
    }

    ns.tprint(`Trace complete.`);
}
