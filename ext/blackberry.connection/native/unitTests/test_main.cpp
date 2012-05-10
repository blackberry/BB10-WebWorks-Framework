#include <gtest/gtest.h>
#include "../connection_bps.hpp"

TEST(Connection, Functional) {
    webworks::ConnectionBPS *connectionBPS = new webworks::ConnectionBPS();
    EXPECT_EQ(webworks::WIFI, connectionBPS->GetConnectionType());
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
