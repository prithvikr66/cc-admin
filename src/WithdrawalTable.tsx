@@ .. @@
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
               Action
             </th>
+            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+              Status
+            </th>
           </tr>
         </thead>
         <tbody className="bg-white divide-y divide-gray-200">
@@ .. @@
               <td className="px-6 py-4 whitespace-nowrap">
                 <ActionBadge action={request.action} />
               </td>
+              <td className="px-6 py-4 whitespace-nowrap">
+                <StatusBadge status={request.status} />
+              </td>
             </tr>
           ))}
         </tbody>