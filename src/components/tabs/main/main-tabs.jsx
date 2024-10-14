import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import DeployTab from "./deploy"
export function MainTabs({ ctx }) {
    return (
        <Tabs defaultValue="deploy" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
                <TabsTrigger value="write" disabled={true}>Write Contract</TabsTrigger>
            </TabsList>
            <TabsContent value="deploy">
                <DeployTab ctx={ctx} />
            </TabsContent>
            <TabsContent value="write">
                <Card>
                    <CardHeader>
                        <CardTitle>Write</CardTitle>
                        <CardDescription>
                            Handle Contract
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">

                    </CardContent>
                    <CardFooter>
                        <Button>Write</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    )
}